import { SUPPORTED_CHAIN_IDS, TChainItem } from '@/constants/chains';
import {
  getDomainSeparator,
  getEncoded1271MessageHash,
  getEncodedSHA,
  DEFAULT_GUARDIAN_HASH,
  DEFAULT_GUARDIAN_SAFE_PERIOD,
} from '@/constants/sdk-config';
import { formatHex, paddingZero } from '@/utils/format';
import { Bundler, SignkeyType, SoulWallet, Transaction } from '@soulwallet/sdk';
import { DecodeUserOp } from '@soulwallet/decoder';
import { canUserOpGetSponsor } from '@/utils/ethRpc/sponsor';
import keyring from './keyring';
import { simulateSendUserOp } from '@/utils/ethRpc/simulate';
import {
  Address,
  createPublicClient,
  Hex,
  http,
  parseEther,
  PublicClient,
  toHex,
  hashMessage,
  serializeSignature,
} from 'viem';
import { createAccount } from '@/utils/ethRpc/create-account';
import { ethErrors } from 'eth-rpc-errors';
import { ABI_SoulWallet } from '@soulwallet/abi';
import eventBus from '@/utils/eventBus';
import { EVENT_TYPES } from '@/constants/events';

class ElytroSDK {
  private _sdk!: SoulWallet;
  private _bundler!: Bundler;
  private _config!: TChainItem;
  private _pimlicoRpc: Nullable<PublicClient> = null;

  constructor() {
    eventBus.on(EVENT_TYPES.CHAIN.CHAIN_INITIALIZED, (chain: TChainItem) => {
      this.resetSDK(chain);
    });
  }

  get bundler() {
    return this._bundler;
  }

  public resetSDK(chainConfig: TChainItem) {
    if (chainConfig.id === this._config?.id) {
      console.log('Elytro::SDK: chainId is the same, no need to reset.');
      return;
    }

    if (!SUPPORTED_CHAIN_IDS.includes(chainConfig.id)) {
      throw new Error(
        `Elytro: chain ${chainConfig.id} is not supported for now.`
      );
    }

    const { factory, fallback, recovery, onchainConfig, bundler, endpoint } =
      chainConfig;
    this._sdk = new SoulWallet(
      endpoint,
      bundler,
      factory,
      fallback,
      recovery,
      onchainConfig
    );

    this._bundler = new Bundler(bundler);
    this._config = chainConfig;
  }

  // TODO: temp, make sure it's unique later.
  // random index, just make sure it's unique. Save to local if user need to export the wallet.
  // also, make sure it keeps the same when it's a same SA address.
  private get _index() {
    return 0; // Math.floor(Math.random() * 100);
  }

  /**
   * Create a smart account wallet address
   * @param eoaAddress - The address of the EOA that will be the owner of the wallet.
   * @param initialGuardianHash - The hash of the initial guardian.
   * @param initialGuardianSafePeriod - The safe period for the initial guardian.
   * @param chainId - The chain id.
   * @returns The address of the wallet.
   */
  public async createWalletAddress(
    eoaAddress: string,
    chainId: number,
    initialGuardianHash: string = DEFAULT_GUARDIAN_HASH,
    initialGuardianSafePeriod: number = DEFAULT_GUARDIAN_SAFE_PERIOD
  ) {
    const initialKeysStrArr = [paddingZero(eoaAddress, 32)];

    const res = await this._sdk?.calcWalletAddress(
      this._index,
      initialKeysStrArr,
      initialGuardianHash,
      initialGuardianSafePeriod,
      chainId
    );

    if (res.isErr()) {
      throw res.ERR;
    } else {
      // no need await for createAccount request. it's not a blocking request.
      createAccount(
        res.OK,
        chainId,
        this._index,
        initialKeysStrArr,
        initialGuardianHash,
        initialGuardianSafePeriod
      );
      return res.OK as Address;
    }
  }

  /**
   * Create an unsigned user operation for deploying a smart account wallet
   * @param eoaAddress - The address of the EOA that will be the owner of the wallet.
   * @param initialGuardianHash - The hash of the initial guardian.
   * @param initialGuardianSafePeriod - The safe period for the initial guardian.
   * @returns The unsigned user operation.
   */
  public async createUnsignedDeployWalletUserOp(
    eoaAddress: string,
    initialGuardianHash: string = DEFAULT_GUARDIAN_HASH,
    initialGuardianSafePeriod: number = DEFAULT_GUARDIAN_SAFE_PERIOD
  ) {
    const emptyCallData = '0x';
    const res = await this._sdk?.createUnsignedDeployWalletUserOp(
      this._index,
      [paddingZero(eoaAddress, 32)],
      initialGuardianHash,
      emptyCallData,
      initialGuardianSafePeriod
    );

    if (res.isErr()) {
      throw res.ERR;
    } else {
      return res.OK;
    }
  }

  public async canGetSponsored(userOp: ElytroUserOperation) {
    const { chainId, entryPoint } = this._config.onchainConfig;
    return await canUserOpGetSponsor(userOp, chainId, entryPoint);
  }

  public async isSmartAccountDeployed(address: string) {
    const code = await this._sdk.provider.getCode(address);
    // when account is not deployed, it's code is undefined or 0x.
    return code !== undefined && code !== '0x';
  }

  public async sendUserOperation(userOp: ElytroUserOperation) {
    // estimate gas before sending userOp, but can not do it here (for the case of sign tx)
    // await this.estimateGas(userOp);

    const res = await this._sdk.sendUserOperation(userOp);

    if (res.isErr()) {
      throw res.ERR;
    } else {
      return res.OK;
    }
  }

  public async signUserOperation(userOp: ElytroUserOperation) {
    const opHash = await this._sdk.userOpHash(userOp);

    if (opHash.isErr()) {
      throw opHash.ERR;
    } else {
      const signature = await this._getSignature(
        opHash.OK,
        0, // 0
        Math.floor(new Date().getTime() / 1000) + 60 * 5 // 5 mins
      );
      userOp.signature = signature;
      return { signature, opHash: opHash.OK };
    }
  }

  public async getUserOperationReceipt(userOpHash: string) {
    try {
      const res = await this._bundler?.eth_getUserOperationReceipt(userOpHash);

      if (res?.isErr()) {
        throw res.ERR;
      } else if (res?.OK) {
        return { ...res.OK.receipt };
      }
    } catch (error) {
      console.error('Elytro: Failed to get user operation receipt.', error);
      return null;
    }
  }

  // private async _getPackedUserOpHash(userOp: ElytroUserOperation) {
  //   const opHash = await this._sdk.userOpHash(userOp);

  //   if (opHash.isErr()) {
  //     throw opHash.ERR;
  //   } else {
  //     const packedHash = await this._sdk.packRawHash(
  //       opHash.OK,
  //       0, // start time
  //       Math.floor(new Date().getTime() / 1000) + 60 * 5 // end time
  //     );

  //     if (packedHash.isErr()) {
  //       throw packedHash.ERR;
  //     } else {
  //       return { ...packedHash.OK, userOpHash: opHash.OK };
  //     }
  //   }
  // }

  private async _isSignatureValid(
    address: Hex,
    messageHash: Hex,
    signature: Hex
  ) {
    const _client = createPublicClient({
      chain: this._config,
      transport: http(this._config.endpoint),
    });

    const magicValue = await _client.readContract({
      address,
      abi: ABI_SoulWallet,
      functionName: 'isValidSignature',
      args: [messageHash, signature],
    });

    if (magicValue !== '0x1626ba7e') {
      throw new Error('Elytro: Invalid signature.');
    }
  }

  private async _getSignature(
    messageHash: string,
    validStartTime?: number,
    validEndTime?: number
  ) {
    const rawHashRes = await this._sdk.packRawHash(
      messageHash,
      validStartTime,
      validEndTime
    );

    if (rawHashRes.isErr()) {
      throw rawHashRes.ERR;
    }

    // TODO： move sign userOp to wallet controller, so the keyring will be same instance
    await keyring.tryUnlock();

    // // raw sign -> personal sign
    // const _eoaSignature = await keyring.owner?.signMessage({
    //   message: { raw: rawHashRes.OK.packedHash as Hex },
    // });

    const _eoaSignature = keyring.signingKey?.signDigest(
      rawHashRes.OK.packedHash
    );

    if (!_eoaSignature) {
      throw new Error('Elytro: Failed to sign message.');
    }

    const _eoaSignatureHex = serializeSignature({
      r: _eoaSignature.r as Hex,
      s: _eoaSignature.s as Hex,
      v: BigInt(_eoaSignature.v),
    });

    const signRes = await this._sdk.packUserOpEOASignature(
      this._config.validator,
      _eoaSignatureHex,
      rawHashRes.OK.validationData
    );

    if (signRes.isErr()) {
      throw signRes.ERR;
    } else {
      return signRes.OK; // signature
    }
  }

  public async getDecodedUserOperation(userOp: ElytroUserOperation) {
    if (userOp.callData?.length <= 2) {
      return null;
    }

    const res = await DecodeUserOp(
      this._config.id,
      this._config.onchainConfig.entryPoint,
      userOp
    );

    if (res.isErr()) {
      throw res.ERR;
    } else {
      return res.OK;
    }
  }

  public async simulateUserOperation(userOp: ElytroUserOperation) {
    return await simulateSendUserOp(
      userOp,
      this._config.onchainConfig.entryPoint,
      this._config.id
    );
  }

  private async _getFeeDataFromSDKProvider() {
    try {
      const fee = await this._sdk.provider.getFeeData();
      return fee;
    } catch {
      throw ethErrors.rpc.server({
        code: 32011,
        message: 'Elytro:Failed to get fee data.',
      });
    }
  }

  private async _getPimlicoFeeData() {
    const newRpcUrl = this._config.bundler;
    if (!this._pimlicoRpc || this._pimlicoRpc.transport.url !== newRpcUrl) {
      this._pimlicoRpc = createPublicClient({
        transport: http(newRpcUrl),
      });
    }

    const ret = await this._pimlicoRpc.request({
      method: 'pimlico_getUserOperationGasPrice' as SafeAny,
      params: [] as SafeAny,
    });
    return (ret as SafeAny)?.standard;
  }

  private async _getFeeData() {
    let gasPrice;
    if (this._config.bundler.includes('pimlico')) {
      // pimlico uses different gas price
      gasPrice = await this._getPimlicoFeeData();
    } else {
      gasPrice = await this._getFeeDataFromSDKProvider();
    }
    return gasPrice;
  }

  public async estimateGas(
    userOp: ElytroUserOperation,
    useDefaultGasPrice = true
  ) {
    // looks like only deploy wallet will need this
    if (useDefaultGasPrice) {
      const gasPrice = await this._getFeeData();

      // todo: what if it's null? set as 0?
      userOp.maxFeePerGas = gasPrice?.maxFeePerGas ?? 0;
      userOp.maxPriorityFeePerGas = gasPrice?.maxPriorityFeePerGas ?? 0;
    }

    // todo: sdk can be optimized (fetch balance in sdk)

    const res = await this._sdk.estimateUserOperationGas(
      this._config.validator,
      userOp,
      {
        [userOp.sender]: {
          balance: toHex(parseEther('1')),
          // getHexString(
          //   await this._sdk.provider.getBalance(userOp.sender)
          // ),
        },
      },
      SignkeyType.EOA // 目前仅支持EOA
    );

    if (res.isErr()) {
      throw res.ERR;
    } else {
      const {
        callGasLimit,
        preVerificationGas,
        verificationGasLimit,
        paymasterPostOpGasLimit,
        paymasterVerificationGasLimit,
      } = res.OK;

      userOp.callGasLimit = BigInt(callGasLimit);
      userOp.preVerificationGas = BigInt(preVerificationGas);
      userOp.verificationGasLimit = BigInt(verificationGasLimit);

      if (
        userOp.paymaster !== null &&
        typeof paymasterPostOpGasLimit !== 'undefined' &&
        typeof paymasterVerificationGasLimit !== 'undefined'
      ) {
        userOp.paymasterPostOpGasLimit = BigInt(paymasterPostOpGasLimit);
        userOp.paymasterVerificationGasLimit = BigInt(
          paymasterVerificationGasLimit
        );
      }

      return userOp;
    }
  }

  public async getRechargeAmountForUserOp(
    userOp: ElytroUserOperation,
    transferValue: bigint
  ) {
    const hasSponsored = await this.canGetSponsored(userOp);

    if (!hasSponsored) {
      await this.estimateGas(userOp);
    }

    const res = await this._sdk.preFund(userOp);

    if (res.isErr()) {
      throw res.ERR;
    } else {
      const {
        missfund,
        prefund,
        //deposit, prefund
      } = res.OK;
      const balance = await this._sdk.provider.getBalance(userOp.sender);
      const missAmount = hasSponsored
        ? transferValue - balance // why transferValue is not accurate? missfund is wrong during preFund?
        : BigInt(missfund) + transferValue - balance;

      return {
        userOp,
        calcResult: {
          balance, // user balance
          gasUsed: prefund,
          hasSponsored, // for this userOp, can get sponsored or not
          missAmount: missAmount > 0n ? missAmount : 0n, // for this userOp, how much it needs to deposit
          needDeposit: missAmount > 0n, // need to deposit or not
          suspiciousOp: missAmount > parseEther('0.001'), // if missAmount is too large, it may considered suspicious
        } as TUserOperationPreFundResult,
      };
    }
  }

  public async signMessage(message: Hex, saAddress: Address) {
    const hashedMessage = hashMessage({ raw: message });
    const encode1271MessageHash = getEncoded1271MessageHash(hashedMessage);
    const domainSeparator = getDomainSeparator(
      toHex(this._config.id),
      saAddress
    );
    const encodedSHA = getEncodedSHA(domainSeparator, encode1271MessageHash);

    const signature = await this._getSignature(encodedSHA);

    await this._isSignatureValid(saAddress, hashedMessage, signature as Hex);

    return signature;
  }

  public async createUserOpFromTxs(from: string, txs: Transaction[]) {
    const gasPrice = await this._getFeeData();
    const _userOp = await this._sdk.fromTransaction(
      formatHex(gasPrice?.maxFeePerGas ?? 0),
      formatHex(gasPrice?.maxPriorityFeePerGas ?? 0),
      from,
      txs as Transaction[]
    );

    if (_userOp.isErr()) {
      throw _userOp.ERR;
    } else {
      return _userOp.OK;
    }
  }

  // public async getPreFund(
  //   userOp: ElytroUserOperation,
  //   transferValue: bigint,
  //   isValidForSponsor: boolean
  // ) {
  //   const res = await this._sdk.preFund(userOp);

  //   if (res.isErr()) {
  //     throw res.ERR;
  //   } else {
  //     const preFund = res.OK;
  //     const _balance = await this._sdk.provider.getBalance(userOp.sender);
  //     const missFund = BigInt(preFund.missfund);

  //     if (!isValidForSponsor || transferValue > 0) {
  //       const maxMissFoundEth = '0.001';
  //       const maxMissFund = parseEther(maxMissFoundEth);

  //       const fundRequest = isValidForSponsor
  //         ? transferValue
  //         : transferValue + missFund;

  //       if (fundRequest > maxMissFund) {
  //         throw new Error(
  //           'Elytro: We may encounter fund issues. Please try again.'
  //         );
  //       }

  //       if (fundRequest > _balance) {
  //         throw new Error('Elytro: Insufficient balance.');
  //       }
  //     }
  //   }
  // }

  // private _isReceiptValid(receipt: unknown): boolean {
  //   return (
  //     receipt &&
  //     receipt !== UserOperationStatusEn.pending &&
  //     receipt.transactionHash
  //   );
  // }
}

export const elytroSDK = new ElytroSDK();
