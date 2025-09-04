function HomeVideo() {
  return (
    <div>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full scale-100 object-cover"
        src="../src/assets/video/mainVideo.mp4"
        type="video/mp4"
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold">당신의 제테크 멘토</h1>
        <p className="mt-2 text-lg">검증된 멘토와 오프라인 매칭 서비스</p>
      </div>
    </div>
  );
}

export default HomeVideo;
