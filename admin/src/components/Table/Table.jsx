import React from "react";
import "./table.css";

const Table = () => {
  return (
    <div className="p-10 overflow-x-auto rounded-none">
      <table className="table w-full rounded-none">
        {/* head */}
        <thead className="rounded-none">
          <tr>
            <th className="capitalize text-[21px] bg-white">Sl.No</th>
            <th className="capitalize text-[21px] bg-white">Device Name</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}

          <tr className="active">
            <td>1</td>
            <td>Himalaya Face Wash</td>
          </tr>
          <tr className="active">
            <td>1</td>
            <td>Himalaya Face Wash</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
