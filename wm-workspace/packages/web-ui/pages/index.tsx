import { Box, Button } from '@mui/material';
import { getDataAll } from '@wm-workspace/firebase';
import { Autocomplete } from '@wm-workspace/components';
import { DocumentData } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { Fragment, useEffect } from 'react';
import { ajax } from 'rxjs/ajax';
import {
  catchError,
  distinct,
  map,
  of,
  pipe,
  Subject,
  tap,
  debounce,
  interval,
  Observable,
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

  // useEffect(() => {
  //   subject
  //     .pipe(
  //       distinct(),
  //       debounce(() => interval(500)),
  //       tap((t) => console.log(t)),
  //       switchMap((t) => {
  //         console.log('switchMap', t);

  //         return ajax('https://jsonplaceholder.typicode.com/posts').pipe(
  //           map((res) => res.response),
  //           catchError((error) => {
  //             console.log('error: ', error);
  //             return of(error);
  //           })
  //         );
  //       })
  //     )
  // }, [subject]);

  return (
    <div>
      <Fragment>
        {JSON.stringify(data, undefined, 2)}
        <Box px={5}>
          <Autocomplete<PostType>
            name="test"
            subject={subject}
            callback={() => {
              // subject.next(text);
              return subject.pipe(
                distinct(),
                debounce(() => interval(500)),
                tap((t) => console.log(t)),
                switchMap((t) => {
                  console.log('switchMap', t);

                  // TODO: return ajax function to autocomplete call
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

              // return ajax('https://jsonplaceholder.typicode.com/posts').pipe(
              //   map((res) => res.response),
              //   catchError((error) => {
              //     console.log('error: ', error);
              //     return of(error);
              //   })
              // );
              // return of([]);
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
