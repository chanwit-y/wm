import { Button } from '@mui/material';
import { getDataAll } from '@wm-workspace/firebase';
import { DocumentData } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { Fragment, useEffect } from 'react';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  const [data, setData] = useState<DocumentData[]>([]);
  // const dataAll = useMemo(async () => getDataAll('product'), []);

  useEffect(() => {

    const load = async () => {
      const x = await getDataAll("product");
      setData(x);
    }
    load();

  }, [])

  return (
    <div>
      <Fragment>
        {JSON.stringify(data, undefined, 2)}
        <Button>Test</Button>
      </Fragment>
    </div>
  );
}

export default Index;
