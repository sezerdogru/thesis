"use client";

import useFetchHook from "@/hooks/useFetchHook";
import Upload from "./components/Upload";
import List from "./components/List";

const App = () => {
  const { images, loading, error } = useFetchHook();

  return (
    <div className="flex flex-col px-4 lg:px-40 py-8">
      <Upload />
      <List images={images} error={error} loading={loading} />
    </div>
  );
};

export default App;
