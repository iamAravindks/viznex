import React from "react";

const Table = () => {
  return (
    <div className="p-10 overflow-x-auto rounded-none">
      <table className="table w-full border-separate rounded-none border-spacing-4">
        {/* head */}
        <thead className="border-b-4 rounded-none">
          <tr>
            <th className="capitalize text-[21px] bg-white">Slot</th>
            <th className="capitalize text-[21px] bg-white">Name</th>
            <th className="capitalize text-[21px] bg-white">Duration</th>
            <th className="capitalize text-[21px] bg-white">Queue</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <td>1</td>
            <td>Himalaya Face Wash</td>
            <td>0:45 min</td>
            <td>#1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Himalaya Face Wash</td>
            <td>0:45 min</td>
            <td>#1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
