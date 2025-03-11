import { Fragment } from "react";

const ListItemLoader = ({ index }) => {

  return (
    <Fragment key={index}>
      <tr
        className="hidden md:table-row active animate-pulse h-[62px]"
      >
        <td>
          <div className="rounded-full bg-base-content h-[42px] w-[42px] opacity-30"></div>
        </td>
        <td>
          <div className="rounded-lg bg-base-content h-[12px] w-[38px] opacity-30"></div>
        </td>
        <td>
          <div className="rounded-lg bg-base-content h-[12px] w-[92px] opacity-30"></div>
        </td>
        <td>
          <div className="rounded-lg bg-base-content h-[12px] w-[92px] opacity-30"></div>
        </td>
        <td>
          <div className="rounded-lg bg-base-content h-[12px] w-[72px] opacity-30"></div>
        </td>
        <td>
          <div className="rounded-lg bg-base-content h-[12px] w-full opacity-30"></div>
        </td>
        <td className="text-right flex justify-end">
          <div className="rounded-lg bg-base-content h-[38px] w-[160px] opacity-30"></div>
        </td>
      </tr> 
      <tr
        className="table-row md:hidden active animate-pulse h-[62px]"
      >
        <td>
          <div className="rounded-lg bg-base-content h-[12px] w-[62px] opacity-30"></div>
        </td>
        <td>
          <div className="rounded-lg bg-base-content h-[12px] w-[52px] opacity-30"></div>
        </td>
        <td>
          <div className="rounded-lg bg-base-content h-[12px] w-[62px] opacity-30"></div>
        </td>
      </tr> 
    </Fragment>
  );

};

export default ListItemLoader;