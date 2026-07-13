import { AppHeader } from "../components/AppHeader";

export const PlaceholderPage = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <>
    <AppHeader />
    <div className="screen-content page-header">
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="empty-panel">这一部分将在下一个里程碑继续丰富。</div>
    </div>
  </>
);
