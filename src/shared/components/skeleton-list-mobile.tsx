export const SkeletonListMobile = () => {
  return (
    <div className="gap-xl flex flex-col">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="gap-lg py-2xl px-3xl flex animate-pulse flex-col rounded-lg bg-white shadow-xs"
        >
          <div className="gap-2xl border-secondary pb-lg flex items-center border-b">
            <div className="gap-xs flex flex-1 flex-col">
              <div className="bg-tertiary h-5 w-32 rounded"></div>
              <div className="bg-tertiary h-5 w-32 rounded"></div>
            </div>
            <div className="gap-xs flex items-center">
              <div className="bg-tertiary h-8 w-8 rounded"></div>
            </div>
          </div>

          <div className="gap-md flex flex-col">
            <div className="gap-md flex flex-col">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="gap-lg flex w-full items-start">
                  <div className="bg-tertiary h-5 w-24 flex-1 rounded"></div>
                  <div className="bg-tertiary h-5 w-20 flex-1 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
