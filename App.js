import React from 'react';
import {View} from 'react-native';
import PDFSignature from './PDFSignature';
import SignaturePad from './SignaturePad';
import UploadPdfScreen from './UploadPdfScreen';

const App = () => {
  
  return (
    <View style={{flex: 1}}>
      {/* <UploadPdfScreen/> */}
      <PDFSignature />
      {/* <SignaturePad/> */}
    </View>
  );
};

export default App;
