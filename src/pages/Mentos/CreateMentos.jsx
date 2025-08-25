import "./CreateMentos.css";

export default function CreateMentos() {
  return (
    <div className="mentoring-create-wrapper">
      <header className="mentoring-create-header">
        <button className="icon-back">{/* ← 아이콘 자리 */}</button>
        <h2 className="mentoring-create-title">멘토링 생성하기</h2>
        <div className="header-icons">
          <button className="icon-home">{/* 집 아이콘 자리 */}</button>
          <button className="icon-user">{/* 사용자 아이콘 자리 */}</button>
        </div>
      </header>
      <form className="mentoring-create-form">
        <div className="form-row">
          <label htmlFor="title" className="form-label">
            제목
          </label>
          <input
            id="title"
            type="text"
            placeholder="공격적으로 저축하는 법 알려준다!!"
            className="form-input"
          />
        </div>
        <div className="form-row">
          <label htmlFor="content" className="form-label">
            내용
          </label>
          <textarea
            id="content"
            placeholder="아이 니 집태만이다! 이 강의 들어라 들어오면 아무 때에 백만원 받을 수 있음!! 거짓말이면 내가 200프로 보장해줌!!!"
            className="form-textarea"
            rows={6}
          />
        </div>
        <div className="form-row">
          <label htmlFor="photo" className="form-label">
            사진
          </label>
          <input
            id="photo"
            type="text"
            placeholder="원하시는 사진을 업로드 해주세요"
            className="form-input"
          />
        </div>
        <div className="form-row">
          <label htmlFor="price" className="form-label">
            가격
          </label>
          <input id="price" type="text" className="form-input" />
        </div>
        <div className="form-row">
          <label htmlFor="location" className="form-label">
            장소
          </label>
          <input id="location" type="text" placeholder="시/군/구" className="form-input" />
        </div>
        <button type="submit" className="form-submit-btn">
          생성하기
        </button>
      </form>
    </div>
  );
}
