import React from "react";

const CustomerModal = () => {
  const handleModal = () => {
    console.log("Modal Clicked");
  };
  return (
    <>
      {/* The button to open modal */}
      <label htmlFor="my-modal-3" className="btn">
        open modal
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="relative modal-box">
          <label
            htmlFor="my-modal-3"
            className="absolute btn btn-sm btn-circle right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">
            Congratulations random Internet user!
          </h3>
          <p className="py-4">
            You've been selected for a chance to get one year of subscription to
            lenskart for free!
          </p>
          <div className="btn-section-modal">
            <label htmlFor="my-modal-3" className="btn" onClick={handleModal}>
              Add with func toggle
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerModal;
