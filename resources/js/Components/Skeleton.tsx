export default function Skeleton(){
  return(
    <>
      <div className="flex w-72 flex-col gap-4">
        <div className="skeleton h-80 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </>
  )
}