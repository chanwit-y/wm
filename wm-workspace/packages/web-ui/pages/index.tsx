import { Box, Button } from '@mui/material';
import { getDataAll } from '@wm-workspace/firebase';
import { Autocomplete } from '@wm-workspace/components';
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
      const x = await getDataAll('product');
      setData(x);
    };
    load();
  }, []);

  return (
    <div>
      <Fragment>
        {JSON.stringify(data, undefined, 2)}
        <Box px={5}>
          <Autocomplete<string>
            name="test"
            data={['a', 'b', 'c']}
            isShowAll={true}
            optionLabel={(opt) => opt}
            isShowSearchIcon={true}
            render={(props, opt) => (
                <div {...props}>{opt}</div>
            )}
          />
        </Box>
        <Button>Test</Button>
      </Fragment>
    </div>
  );
}

export default Index;
