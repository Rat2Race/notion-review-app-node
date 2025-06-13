<div align="center">

<!-- logo -->
<img src="public/image/tiredMouse.png" width="200"/>

### Notion Review App Backend ✅
[<img src="https://img.shields.io/badge/-readme.md-important?style=flat&logo=google-chrome&logoColor=white" />]()[<img src="https://img.shields.io/badge/project duration-2025.06.01~-green?style=flat&logo=&logoColor=white" />]()

</div>

## 📝 Introduce

이 저장소는 Notion API와 OpenAI API를 이용해 노션 페이지 내용을 기반으로 퀴즈를 생성해 주는 간단한 백엔드 서버입니다.
- **Notion OAuth 연동**: 사용자가 발급한 Notion 액세스 토큰을 데이터베이스에 저장합니다.
- **페이지 검색/조회**: 사용자의 노션 페이지 목록을 조회하거나 특정 페이지의 블록을 읽어 옵니다.
- **퀴즈 생성**: 읽어 온 페이지 내용을 OpenAI API로 전달하여 퀴즈 형식의 문장을 생성합니다.
<br />

## 🗂️ Main Path

- `app.js` – Express 서버 초기화 및 라우터 등록
- `routes/api-router.js` – API 엔드포인트 정의
- `service/` – Notion, OpenAI, 사용자 관리 로직
- `db/` – Sequelize 설정 및 `User` 모델 정의
<br />

## 🔧 Execute

1. 의존성 설치
   ```bash
   npm install
   ```
2. `.env` 파일에 환경 변수를 설정합니다. 필요한 값은 다음과 같습니다.
   ```
   PORT=5000
   NOTION_CLIENT_ID=your_notion_client_id
   NOTION_CLIENT_SECRET=your_notion_client_secret
   OPENAI_API_URL=https://api.openai.com/v1/chat/completions
   OPENAI_MODEL=gpt-3.5-turbo
   OPENAI_ROLE=system
   OPENAI_INSTRUCTION="질문에 대한 지시문"
   OPENAI_API_KEY=your_openai_api_key
   DB_NAME=notion
   DB_USER=root
   DB_PASSWORD=password
   DB_HOST=localhost
   DB_DIALECT=mysql
   ```
3. 서버 실행
   ```bash
   node app.js
   ```

기본 포트는 `5000`이며, `.env` 파일을 통해 변경할 수 있습니다.

<br />

## 📄 APIs

- `POST /api/oauth/callback` – Notion OAuth 인증 후 토큰 저장
- `POST /api/search` – 사용자의 노션 페이지 목록 조회 또는 특정 페이지 읽기
- `POST /api/quiz` – 페이지 내용을 이용해 퀴즈 생성

---

간단한 예제 서버로, 필요에 따라 코드와 데이터베이스 구조를 확장하여 사용할 수 있습니다.
