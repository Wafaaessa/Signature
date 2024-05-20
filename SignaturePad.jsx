import React from 'react';
import Signature from 'react-native-signature-canvas';
import { StyleSheet,View, Image } from 'react-native';

const SignaturePad = ({onSignatureChange}) => {
  
  return (
    <>


    <Signature
      onOK={onSignatureChange}
      onEmpty={() => console.log('___onEmpty')}
      descriptionText="Sign"
      clearText="Clear"
      confirmText="Save"
    />
    </>
  );
};

export default SignaturePad;
const styles = StyleSheet.create({
  signature: {
    flex: 1,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 100,
  
  },
  

});









