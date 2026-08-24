import { APP_NAME, healthCheck } from '@cognit-engine-poc/shared';
import styles from './page.module.css';

export default function Index() {
  const web = healthCheck('web');

  return (
    <main className={styles.page}>
      <h1>{APP_NAME}</h1>
      <p>
        {web.service}: {web.status}
      </p>
    </main>
  );
}
