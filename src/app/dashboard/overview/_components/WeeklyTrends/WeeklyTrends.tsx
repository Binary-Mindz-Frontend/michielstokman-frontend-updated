function WeeklyTrends() {
  const trends = [
    { label: 'This Week', views: '3,210', pulse: '7.8', shares: '312' },
    { label: 'Last Week', views: '3,210', pulse: '7.8', shares: '312' },
    { label: '2 Weeks Ago', views: '3,210', pulse: '7.8', shares: '312' },
    { label: '3 Weeks Ago', views: '3,210', pulse: '7.8', shares: '312' },
  ];

  return (
    <div className="rounded-md bg-[#F5F2F0] p-6">
      <h2 className="text-dark-primary mb-0.5 text-xl font-semibold md:text-2xl">Weekly Trends</h2>
      <p className="text-secondary text-sm sm:text-base">Performance over recent weeks</p>

      <div>
        {trends.map((item, index) => (
          <div
            key={index}
            className="border-primary/20 flex flex-col justify-between gap-x-4 gap-y-0.5 border-b py-5 last:border-0 sm:flex-row sm:items-center"
          >
            <span className="text-dark-primary text-lg font-semibold sm:text-xl">
              {item?.label}
            </span>

            <div className="text-secondary flex gap-4 font-medium md:text-lg">
              <span>{item?.views} views</span>
              <span className="text-primary font-semibold">{item?.pulse} pulse</span>
              <span>{item?.shares} shares</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyTrends;
