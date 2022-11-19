import * as React from "react"
import * as BsIcons from "react-icons/bs"
import * as AiIcons from "react-icons/ai"
import * as Feather from "react-icons/fi"
import * as Tabler from "react-icons/tb"
import * as BoxIcons from "react-icons/bi"

interface GridFrameProps {
  children?: React.ReactNode
}

const btnStyle = "ml-1 p-1 text-2xl rounded-full"

export const GridFrame: React.FC<GridFrameProps> = (props) => {
  return (
    <div className="w-full h-full flex flex-row">
      <div className="flex flex-col flex-none w-6 bg-base-200 h-full justify-center">
        <BoxIcons.BiGridVertical className="w-full mx-auto cursor-move" />
      </div>
      <div className="flex flex-grow flex-col w-[calc(100%-24px)] h-full relative">
        <div className="h-6 m-1 flex flex-row flex-none justify-end">
          <Tabler.TbArrowsMaximize className={`${btnStyle} btn-primary`} />
          <Feather.FiEdit className={`${btnStyle} btn-primary`} />
          <AiIcons.AiOutlineClose className={`${btnStyle} btn-ghost`} />
        </div>
        <div className="p-2 h-[calc(100%-24px)] flex flex-grow bg-base-400 text-neutral-content">
          <div className="w-full h-full">{props.children}</div>
        </div>
        <ResizeHandle />
      </div>
    </div>
  )
}

const ResizeHandle: React.FC<{}> = () => {
  return <BsIcons.BsTextareaResize className="absolute right-0 bottom-0 text-xs" />
}
