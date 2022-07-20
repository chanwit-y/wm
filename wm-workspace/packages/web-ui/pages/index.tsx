import { Box, Button } from '@mui/material';
import { getDataAll } from '@wm-workspace/firebase';
import { Autocomplete, autoCompleteAPI } from '@wm-workspace/components';
import { Test } from '@chanwit-y/c-lib';
import { DocumentData } from 'firebase/firestore';
import { useState } from 'react';
import { Fragment, useEffect } from 'react';
import { ajax } from 'rxjs/ajax';
import {
  catchError,
  map,
  of,
  Subject,
  switchMap,
} from 'rxjs';

type PostType = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

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

  const subject = new Subject<string>();

  return (
    <div>
      <Fragment>
        {JSON.stringify(data, undefined, 2)}
        <Test />
        <Box px={5}>
          <Autocomplete<PostType>
            name="test"
            subject={subject}
            callback={() => {
              return autoCompleteAPI(
                subject,
                switchMap((t) => {
                  return ajax(
                    'https://jsonplaceholder.typicode.com/posts'
                  ).pipe(
                    map((res) => res.response),
                    catchError((error) => {
                      console.log('error: ', error);
                      return of(error);
                    })
                  );
                })
              );
            }}
            optionLabel={(opt: PostType) => opt.title}
            isShowSearchIcon={true}
            render={(props, opt) => <div {...props}>{opt.title}</div>}
          />
        </Box>
        <Button>Test</Button>
      </Fragment>
    </div>
  );
}

export default Index;
