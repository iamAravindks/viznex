import React from "react";
import AdPageTable from "../../components/Table/AdPageTable";

import Modal from "../../components/Modals/Modal";

const AdsPage = () => {
  return (
    <div className="w-full pr-12 pt-11">
      <div className="flex justify-end button-section">
        <Modal />
      </div>
      <div className="mt-12 add-videos-section">
        <AdPageTable />
      </div>
    </div>
  );
};

export default AdsPage;
