"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="panel empty" role="alert">
      <h1>화면을 불러오지 못했습니다</h1>
      <p>Something went wrong. 다시 시도해주세요.</p>
      <button className="btn" onClick={reset}>
        다시 시도 / Retry
      </button>
    </section>
  );
}
