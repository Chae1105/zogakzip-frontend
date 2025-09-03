// firestore에 저장할 데이터 구조 설계
// tag는 고민 중

/*
const groupData = {
  groupName: "name",
  groupPassword: "password",
  imageUrl: null,
  introduction: "소개",
  isPublic: true,
  likeCount: 0,
  members: [""], // 필수 (마이페이지 기능 위해)
  postCount: 0,
  createdAd: ""

  createdBy : "userId" // 추가
};
 */

/*
const userData = {
  email: ""
  password: ""
  imageUrl: ""
  userName: ""
  posts: ["addDoc으로 자동 생성된 ID"] // 삭제
  comments: ["addDoc으로 자동 생성, 해당 post 내 서브 컬렉션"] // 삭제
  joinedGroup: ["그룹 상세 페이지 url에서 useParams()으로 받아온 그룹ID"] // 삭제
}
*/

/*
const postData = {
  groupId: "그룹 상세 페이지에서 게시글 생성 => groupID 받아오기"
  userId: "auth.currentUser !== null 이면 auth.currentUser.uid로 받기"
  title: ""
  content: ""
  imageUrl: ""
  likeCount: 0
  memoryPlace: "추억의 장소(서울, 무슨무슨 카페)"
  createdAt: "게시글 작성일"
  comments(서브 컬렉션)
}
*/

/*
const commentData ={
  userId: "auth.currentUser.uid"
  content: ""
  createdAt: ""
}
*/
