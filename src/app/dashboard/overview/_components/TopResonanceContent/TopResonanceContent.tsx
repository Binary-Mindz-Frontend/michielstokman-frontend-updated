function TopResonanceContent() {
  const topContent = [
    { id: 1, title: 'The Day I Said No', reflections: 342, score: '9.2' },
    { id: 2, title: 'Ocean of Stillness', reflections: 287, score: '9.2' },
    { id: 3, title: 'Body Scan for Grief', reflections: 287, score: '9.2' },
    { id: 4, title: 'Body Scan for Grief', reflections: 287, score: '9.2' },
    { id: 5, title: 'Body Scan for Grief', reflections: 287, score: '9.2' },
  ];

  return (
    <div className="rounded-md bg-[#F5F2F0] p-6">
      <h2 className="text-dark-primary mb-0.5 text-xl font-semibold md:text-2xl">
        Top Resonance Content
      </h2>
      <p className="text-secondary text-sm sm:text-base">Highest pulse scores this month</p>

      <div>
        {topContent?.map((content) => (
          <div
            key={content?.id}
            className="border-primary/20 flex items-center justify-between border-b py-5 last:border-0"
          >
            <div className="flex items-center gap-4">
              <span className="text-secondary mt-1 text-xl">{content?.id}.</span>
              <div>
                <h4 className="text-dark-primary text-lg font-semibold sm:text-xl">
                  {content?.title}
                </h4>
                <p className="text-secondary text-base sm:text-lg md:mt-1">
                  {content?.reflections} reflections
                </p>
              </div>
            </div>
            <span className="text-primary text-lg font-semibold sm:text-xl">{content?.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopResonanceContent;
