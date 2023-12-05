import React from 'react';

import Modal from './Modal';

const ErrorModal = props => {
  
  return (
    <Modal
      onClick={props.onClear}
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<button className="card-button" style={{margin:"0"}} onClick={props.onClear}>Okay</button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
