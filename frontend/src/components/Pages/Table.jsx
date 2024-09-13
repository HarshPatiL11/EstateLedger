import React from "react";

const Table = ({
  owner,
  project,
  carpetarea,
  SellStartprice,
  sellOrLease,
  rentAmount,
}) => {
  return (
    <tr>
      <td>{owner}</td>
      <td>{project}</td>
      <td>{carpetarea}</td>
      <td>{sellOrLease === "Sell" ? SellStartprice : "-"}</td>
      <td>{sellOrLease === "Lease" ? rentAmount : "-"}</td>
      <td>{sellOrLease}</td>
    </tr>
  );
};

export default Table;
