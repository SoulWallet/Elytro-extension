import ContentWrapper from '@/components/ContentWrapper';
import React from 'react';

export default function Start() {
  return (
    <ContentWrapper title="Start Recovery" currentStep={2} allSteps={3}>
      <div>Start</div>
    </ContentWrapper>
  );
}
