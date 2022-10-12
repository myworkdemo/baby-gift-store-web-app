import React from "react";

const CunformationDialogBox = ({show, close, deleteRecord}) => {
  return (
    <>
      <div id="cunformationDialogBox" className={`modal ${ (show)? 'showDialogBox' : '' }`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="warning-title">Warning!</h2>
            <span className="close" onClick={() => close()}>&times;</span>
          </div>
          <div className="modal-body">
            <p className="warning-msg">Are you sure you want to delete this item?</p>
            <p className="warning-desciption"> <span>NOTE: </span> Once you delete it you will not be able to recover.</p>
          </div>
          <div className="modal-footer">
            
            <button className="btn delete-no" onClick={() => close()}>No</button>
            <button className="btn delete-yes" onClick={() => deleteRecord()}>Yes</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CunformationDialogBox;
