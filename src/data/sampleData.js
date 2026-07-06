const DATES = ["Jun 30", "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6"];

function trend(values) {
  return DATES.map((date, i) => ({ date, value: values[i] }));
}

export const initialData = {
  updatedOn: "7/6/2026",
  video: {
    caption: "#solutionsinnov8 #tiktokstudio #frontend #saas #buildinpublic",
    postedDate: "Posted on 7/3/2026",
    stats: { plays: "39K", likes: "587", comments: "12", shares: "6", bookmarks: "9" },
  },
  sidebarVideos: [
    { id: 1, title: "#solutionsinnov8 #tiktokstudio #frontend", hue: 210, active: true },
    { id: 2, title: "storytime with my dog", hue: 55 },
    { id: 3, title: "get ready with me", hue: 140 },
    { id: 4, title: "day in my life vlog", hue: 165 },
    { id: 5, title: "this recipe changed everything", hue: 195 },
    { id: 6, title: "No description", hue: 255 },
    { id: 7, title: "outfit transition", hue: 300 },
    { id: 8, title: "No description", hue: 340 },
    { id: 9, title: "q&a answering your questions", hue: 30 },
    { id: 10, title: "behind the scenes", hue: 100 },
  ],
  overview: {
    activeMetric: "views",
    metrics: [
      {
        key: "views",
        label: "Video views",
        value: "39K",
        trend: trend([18200, 27400, 32100, 35600, 37300, 38400, 39000]),
        yTickFormatter: "compact",
      },
      {
        key: "playTime",
        label: "Total play time",
        value: "8h 38m 38s",
        trend: trend([0.4, 0.9, 1.8, 3.0, 3.33, 3.2, 3.1]),
        yTickFormatter: "hours",
      },
      {
        key: "watchTime",
        label: "Average watch time",
        value: "0.69s",
        trend: trend([6.1, 6.0, 6.4, 8.0, 4.1, 2.0, 0.69]),
        yTickFormatter: "seconds",
      },
      {
        key: "fullVideo",
        label: "Watched full video",
        value: "0.1%",
        trend: trend([0.3, 0.25, 0.2, 0.15, 0.12, 0.1, 0.1]),
        yTickFormatter: "percent",
      },
      {
        key: "newFollowers",
        label: "New followers",
        value: "3",
        trend: trend([0, 0, 0, 1, 0, 1, 1]),
        yTickFormatter: "plain",
      },
    ],
    chartNote:
      "Chart shows the data trend during the first 7 days after posting.",
    retention: {
      peakTime: "0:03",
      duration: "0:18",
      data: [
        { t: "0:00", pct: 100 },
        { t: "0:01", pct: 61 },
        { t: "0:02", pct: 40 },
        { t: "0:03", pct: 29 },
        { t: "0:04", pct: 22 },
        { t: "0:05", pct: 17 },
        { t: "0:06", pct: 13 },
        { t: "0:07", pct: 10 },
        { t: "0:08", pct: 9 },
      ],
    },
    trafficSource: [
      { label: "For You", pct: 78.3 },
      { label: "Sound", pct: 8.6 },
      { label: "Personal profile", pct: 6.1 },
      { label: "Search", pct: 4.0 },
      { label: "Following", pct: 2.0 },
      { label: "Other", pct: 1.0 },
    ],
    searchQueries: [
      { term: "funny dog videos", pct: 34 },
      { term: "cute puppy", pct: 27 },
      { term: "storytime", pct: 19 },
      { term: "viral tiktok", pct: 12 },
      { term: "trending sounds", pct: 8 },
    ],
  },
  viewers: {
    total: { value: "5K", changeValue: "+520", changeLabel: "(vs 1d ago)" },
    viewerTypes: { leftPct: 78, leftLabel: "New viewers", rightLabel: "Returning viewers" },
    followerTypes: { leftPct: 91, leftLabel: "Non-followers", rightLabel: "Followers" },
    age: [
      { label: "18-24", pct: 41 },
      { label: "25-34", pct: 33 },
      { label: "35-44", pct: 14 },
      { label: "45-54", pct: 7 },
      { label: "55+", pct: 5 },
    ],
    gender: { malePct: 47, femalePct: 51, otherPct: 2 },
    locations: [
      { country: "United States", pct: 38.4, expandable: true },
      { country: "United Kingdom", pct: 14.2 },
      { country: "Canada", pct: 11.0 },
      { country: "Australia", pct: 8.3 },
      { country: "Germany", pct: 6.1 },
    ],
  },
  engagement: {
    likes: {
      peakTime: "0:05",
      duration: "0:18",
      data: [
        { t: "0:00", pct: 5 },
        { t: "0:01", pct: 12 },
        { t: "0:02", pct: 22 },
        { t: "0:03", pct: 38 },
        { t: "0:04", pct: 55 },
        { t: "0:05", pct: 72 },
        { t: "0:06", pct: 60 },
        { t: "0:07", pct: 44 },
        { t: "0:08", pct: 30 },
      ],
    },
    emptyWordsNote:
      "You'll be able to see this information once there's enough data for analysis.",
    topWords: [
      { word: "-", pct: null },
      { word: "-", pct: null },
      { word: "-", pct: null },
      { word: "-", pct: null },
      { word: "-", pct: null },
    ],
  },
};
