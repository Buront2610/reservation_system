import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

const issueItems = [
  '設定値がコードに埋め込まれており、環境差分の吸収と安全な運用が難しい',
  'フロントエンドとバックエンドの責務が混在し、契約変更の影響範囲が見えにくい',
  'テスト基盤が薄く、回帰確認が属人的になっている',
  '認証・初期設定・予約編集の導線が分散し、画面の意図が把握しづらい',
  'README が実態に追従しておらず、保守の入口情報が不足している',
];

const policyItems = [
  'フェーズ1: 現状診断を可視化し、課題と優先度を共有する',
  'フェーズ2: 設定・API 契約・型定義を整理して土台を固める',
  'フェーズ3: 予約/管理画面を責務ごとに再構成し、テストを追加する',
  'フェーズ4: 運用ドキュメントと監視手順を更新し、継続改善できる状態にする',
];

const startItems = [
  'ログイン画面に現状監査と改修方針を表示し、全面改修の入口を明確化',
  'API 接続先を環境変数で切り替えられるようにして、再構築の初手を小さく着手',
  'README を実態ベースの分析・改修計画に更新し、次工程の判断材料を整理',
];

const RenovationOverview: React.FC = () => {
  return (
    <Card sx={{ maxWidth: 720, width: '100%' }}>
      <CardHeader
        title="現行アプリの監査結果"
        subheader="問題点を列挙し、改修方針を示したうえで全面改修に着手します。"
      />
      <CardContent>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          <Chip color="error" label="問題点の棚卸し" />
          <Chip color="warning" label="改修方針の明示" />
          <Chip color="success" label="改修着手" />
        </Stack>

        <Typography variant="h6" gutterBottom>
          主な問題点
        </Typography>
        <List dense disablePadding>
          {issueItems.map((item) => (
            <ListItem key={item} disableGutters>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          全面改修の方針
        </Typography>
        <List dense disablePadding>
          {policyItems.map((item) => (
            <ListItem key={item} disableGutters>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          今回着手したこと
        </Typography>
        <List dense disablePadding>
          {startItems.map((item) => (
            <ListItem key={item} disableGutters>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RenovationOverview;
