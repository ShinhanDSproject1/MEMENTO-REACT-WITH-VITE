import "./MyProfile.css";

export default function MyProfile() {
  return (
    <main className="container">
      <h1 className="my-title">내 프로필</h1>

      <section className="card">
        <div className="field row large">
          <label className="head-label" htmlFor="name">
            이름
          </label>
          <input id="name" className="input" />
        </div>

        <div className="field row">
          <label className="label" htmlFor="phone">
            전화번호
          </label>
          <input id="phone" className="input" />
        </div>

        <div className="field row">
          <label className="label" htmlFor="birth">
            생년월일
          </label>
          <input id="dob" className="input" />
        </div>

        <div className="card-actions">
          <button className="btn-update">프로필 수정</button>
        </div>
      </section>

      <h2 className="information">기본정보</h2>

      <section className="card">
        <div className="field row">
          <label className="label" htmlFor="userid">
            아이디
          </label>
          <input id="userid" className="input" />
        </div>

        <div className="field row">
          <label className="label" htmlFor="pw">
            비밀번호
          </label>
          <input id="pw" className="input" type="password" />
        </div>

        <div className="card-actions">
          <button className="btn-info-update">기본정보 변경</button>
        </div>
      </section>

      <div className="bottom">
        <button className="btn-exit">계정 탈퇴</button>
      </div>
    </main>
  );
}
