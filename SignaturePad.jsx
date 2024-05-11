import React from 'react';
import Signature from 'react-native-signature-canvas';

const SignaturePad = ({onSignatureChange}) => {
  return (
    <Signature
      onOK={onSignatureChange}
      onEmpty={() => console.log('___onEmpty')}
      descriptionText="Sign"
      clearText="Clear"
      confirmText="Save"
    />
  );
};

export default SignaturePad;
