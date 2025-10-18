# Chat Demo Frontend

chat-demo-backendに対応するReactフロントエンドアプリケーションです。

※追記
- ほとんどのコードをclaude codeが生成しています

## 技術スタック

- **React 18** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **WebSocket** - リアルタイム通信

## 主な機能

- ユーザー名管理（ローカルストレージに保存）
- ルーム一覧表示・作成
- リアルタイムチャット
- メッセージ履歴表示
- WebSocketによる新着メッセージのリアルタイム受信

## アーキテクチャ

### コンポーネント構成

```
src/
├── components/
│   ├── LoginForm.tsx       # ユーザー名入力フォーム
│   ├── RoomList.tsx        # ルーム一覧表示
│   ├── CreateRoomForm.tsx  # ルーム作成フォーム
│   ├── ChatRoom.tsx        # チャットルーム全体
│   ├── MessageList.tsx     # メッセージ一覧
│   └── MessageInput.tsx    # メッセージ入力フォーム
├── hooks/
│   ├── useWebSocket.ts     # WebSocket接続管理
│   └── useLocalStorage.ts  # ローカルストレージ管理
├── api/
│   └── client.ts           # REST APIクライアント
├── types/
│   └── index.ts            # 型定義
├── App.tsx                 # メインアプリケーション
└── main.tsx                # エントリーポイント
```

### 通信フロー

1. **REST API (http://localhost:3000)**
   - ルーム一覧取得: `GET /rooms`
   - ルーム作成: `POST /rooms`
   - メッセージ投稿: `POST /messages`
   - メッセージ履歴取得: `GET /messages?roomId=xxx`

2. **WebSocket (ws://localhost:3001)**
   - 接続: `ws://localhost:3001/?roomId={roomId}&userId={userId}`
   - 初期履歴受信: `{ type: "init", payload: Message[] }`
   - 新着メッセージ: `{ type: "message", payload: {...} }`

## セットアップ

### 前提条件

- Node.js 20+
- バックエンドサーバー（chat-demo-backend）が起動していること

### インストール

```bash
npm install
```

### 環境変数の設定

`.env`ファイルを作成（または`.env.example`をコピー）:

```bash
cp .env.example .env
```

デフォルト値:
```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3001
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

### ビルド

```bash
npm run build
```

ビルド成果物は`dist/`ディレクトリに生成されます。

### プレビュー

```bash
npm run preview
```

ビルドしたアプリケーションをローカルでプレビューします。

## 使い方

### 1. ユーザー名を入力

アプリケーションを開くと、最初にユーザー名入力画面が表示されます。任意のユーザー名を入力してください。

### 2. ルームを作成または選択

- 「Create New Room」フォームで新しいルームを作成できます
- 既存のルーム一覧から参加したいルームをクリックします

### 3. チャット

- ルームに入ると、過去のメッセージ履歴が表示されます
- 下部の入力フォームでメッセージを送信できます
- 他のユーザーが送信したメッセージはリアルタイムで表示されます

### 4. ルームを退出

- 「Leave Room」ボタンでルーム一覧に戻ります

### 5. ログアウト

- ルーム一覧画面の「Logout」ボタンでログアウトし、ユーザー名入力画面に戻ります

## カスタマイズ

### API URLの変更

`.env`ファイルで`VITE_API_URL`と`VITE_WS_URL`を変更してください。

### スタイルのカスタマイズ

Tailwind CSSを使用しています。`tailwind.config.js`でテーマをカスタマイズできます。

## トラブルシューティング

### WebSocketに接続できない

1. バックエンドサーバーが起動しているか確認
2. `.env`の`VITE_WS_URL`が正しいか確認
3. ブラウザのコンソールでエラーメッセージを確認

### メッセージが送信できない

1. REST API（http://localhost:3000）が稼働しているか確認
2. ブラウザの開発者ツールでネットワークエラーを確認

### ルームが表示されない

1. バックエンドのデータベースが正しくセットアップされているか確認
2. `/rooms` APIが正常にレスポンスを返しているか確認

## 開発メモ

### 状態管理

- ユーザーIDはローカルストレージに保存され、ページをリロードしても保持されます
- 選択中のルームはコンポーネントステートで管理（リロード時はリセット）

### WebSocket接続

- `useWebSocket`カスタムフックでWebSocket接続を管理
- ルーム選択時に自動接続、退出時に自動切断
- 再接続機能も実装済み

### エラーハンドリング

- API呼び出し失敗時はエラーメッセージを表示
- WebSocketエラーはコンソールに出力

## ライセンス

ISC
