import Link from "next/link";
export default function NotFound() {
  return (
    <section className="panel empty">
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>Page not found. 주소를 확인하거나 홈에서 다시 시작해주세요.</p>
      <Link className="btn" href="/">
        홈으로 / Home
      </Link>
    </section>
  );
}
