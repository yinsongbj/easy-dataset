import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';

export const metadata = {
  title: 'Easy DataSet',
  description: '数据集处理工具',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
