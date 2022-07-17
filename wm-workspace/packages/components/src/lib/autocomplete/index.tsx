import '@wm-workspace/util';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete as MuiAutocomplete,
  FilterOptionsState,
  CircularProgress,
  debounce,
  IconButton,
  TextField,
  AutocompleteFreeSoloValueMapping,
  Box,
  AutocompleteValue,
} from '@mui/material';
import {
  ChangeEvent,
  Children,
  cloneElement,
  Fragment,
  MouseEventHandler,
  ReactElement,
  useEffect,
  useState,
  KeyboardEvent,
  ReactNode,
  HTMLAttributes,
} from 'react';
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormSetValue,
} from 'react-hook-form';
import { get } from 'lodash';
import {
  withValidate,
  isEnglishLetters,
  isEnglishLettersWithNumbers,
} from '@wm-workspace/util';
import { Observable, Subject, switchMap } from 'rxjs';

type ValidateInsideArrayOption = {
  index: number;
  name: string;
  baseName: string;
};

type OptBool = boolean | undefined;
type KeyValue = { [key: string]: any };

type Props<T> = {
  name: string;
  // callback('text on input', callbackParam) { const {key} =  callbackParam; ...}
  subject: Subject<string>;
  callback?: (callbackParam?: KeyValue) => Observable<any>; // Function;
  // parameter for callback function {"key": "value"}
  callbackParam?: KeyValue;
  data?: T[];
  inputValue?: string;
  limitTags?: number;

  isShowAll?: boolean;
  isMultiple?: boolean;
  isShowLoading?: boolean;
  isShowDeleteIcon?: boolean;
  isShowSearchIcon?: boolean;
  isLettersOnly?: boolean;
  isEnglishOnly?: boolean;
  isFilterSelectedOptions?: boolean;
  isDisabled?: boolean;
  isAutoSelect?: boolean;
  isValidate?: boolean;

  frontIcon?: JSX.Element;

  filterOptions?: (options: T[], state: FilterOptionsState<T>) => T[];
  groupBy?: (option: T) => string;
  transformValue?: (value: unknown) => unknown;
  optionLabel: (
    option: T | AutocompleteFreeSoloValueMapping<boolean | undefined>
  ) => string;
  render: (props: HTMLAttributes<any>, option: T) => ReactNode;

  onTextChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDelete?: Function;

  validateInsideArrayOption?: ValidateInsideArrayOption;

  errorName?: string;
  errors?: DeepMap<Record<string, any>, FieldError>;
  setValue?: UseFormSetValue<FieldValues>;

  selectedValue?: AutocompleteValue<T, OptBool, OptBool, OptBool>;
  onSelectedValue?: Function;

  freeSolo?: boolean;
  placeholder?: string;
};

export const Autocomplete = <T extends any>({
  name,
  subject,
  callback,
  callbackParam,
  data,
  inputValue = '',
  limitTags = 4,

  isShowAll = false,
  isMultiple = false,
  isShowLoading = false,
  isShowDeleteIcon = false,
  isShowSearchIcon = true,
  isLettersOnly = false,
  isEnglishOnly = false,
  isDisabled = false,
  isAutoSelect,
  isFilterSelectedOptions = true,

  frontIcon,
  filterOptions,
  groupBy,
  transformValue,
  optionLabel,
  render,
  onTextChange,
  onClick,
  onDelete,
  validateInsideArrayOption,
  errorName,
  errors = undefined,
  setValue,
  selectedValue,
  placeholder,
  onSelectedValue,
  freeSolo,
  isValidate = false,
}: Props<T>) => {
  // const subject = new Subject<string>();
  const [autocompleteValue, setAutocompleteValue] = useState<
    T | undefined | AutocompleteValue<T, OptBool, OptBool, OptBool>
  >(selectedValue ?? null);
  const [textField, setTextField] = useState(inputValue);
  const [options, setOptions] = useState<T[]>([]);
  const [errorAutoComplet, setErrorAutoComplet] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const delayedHandleChange = debounce(
  //   (text: string) => callBackWithOtherParam(text),
  //   500
  // );

  const validateLetters = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isLettersOnly) {
      if (!isEnglishLetters(e.key)) if (e.preventDefault) e.preventDefault();
    } else if (isEnglishOnly) {
      if (!isEnglishLettersWithNumbers(e.key))
        if (e.preventDefault) e.preventDefault();
    }
  };

  useEffect(() => {
    !isOpen && !isShowAll && setOptions([]);
  }, [isOpen]);

  useEffect(() => {
    inputValue && setTextField(inputValue);
  }, [inputValue]);

  useEffect(() => {
    selectedValue
      ? setAutocompleteValue(selectedValue)
      : setAutocompleteValue(null);
    const transform = transformValue && transformValue(selectedValue);
    setValue && setValue(name, transform ? transform : selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    if (isShowAll) {
      setOptions([]);
      const getOptionData = async () => {
        if (callback) {
          // const res = await callback('', callbackParam);
          // res
          //   .pipe(switchMap((res) => res))
          //   .subscribe((res) => setOptions((perv) => [...perv, res]));
          // setOptions(res);
        } else {
          setOptions(data ?? []);
        }
        setIsLoading(false);
      };
      getOptionData();
    }
  }, [isShowAll, data]);

  // const callBackWithOtherParam = async (text: string) => {
  //   setOptions([]);

  //   setIsLoading(true);
  //   // TODO: callback call by switchmap rxjs
  //   // const response = callbackParam
  //   //   ? callback && (await callback(text, callbackParam))
  //   //   : callback && (await callback(text, callbackParam));
  //   // response && setOptions(response);

  //   if (callback) {
  //     console.log('Hi');
  //     // const res = callback && callback(subject, callbackParam);
  //     // console.log(res);
  //     // res && res.subscribe((res) => console.log(res));
  //     // // res &&
  //     //   res
  //     //     .pipe(switchMap((res) => res))
  //     //     .subscribe((res) => setOptions((perv) => [...perv, res]));
  //   }

  //   setIsLoading(false);
  // };

  useEffect(() => {
    if (validateInsideArrayOption && errors) {
      const { baseName, name, index } = validateInsideArrayOption;
      const errorInArray = errors[name];
      const errorObject = errorInArray ? errorInArray[index] : '';
      setErrorAutoComplet(errorObject && errorObject[baseName]);
    } else {
      setErrorAutoComplet(errors && get(errors, errorName ?? name));
    }
  }, [errors, errorName]);

  useEffect(() => {
    console.log(isShowSearchIcon);
  }, [isShowSearchIcon]);

  useEffect(() => {
    console.log('callback');
    callback &&
      callback().subscribe((res) => {
        setOptions([]);
        console.log(res);
        setOptions(res);
        setIsLoading(false);
      });
    // subject.subscribe((res) => console.log(res));
  }, [callback, setOptions, setIsLoading]);

  return (
    <MuiAutocomplete<T, OptBool, OptBool, OptBool>
      fullWidth
      freeSolo={freeSolo}
      filterSelectedOptions={isFilterSelectedOptions}
      openOnFocus
      forcePopupIcon={false}
      autoSelect={isAutoSelect}
      filterOptions={
        filterOptions
          ? (options, state) => {
              const optionsData = filterOptions(options, state);
              return optionsData;
            }
          : undefined
      }
      groupBy={groupBy}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      inputValue={textField}
      onInputChange={(_, newInputValue) => setTextField(newInputValue)}
      multiple={isMultiple}
      limitTags={limitTags}
      options={options}
      loading={isLoading}
      noOptionsText={'Data not found'}
      disabled={isDisabled}
      getOptionLabel={optionLabel}
      renderOption={render}
      value={autocompleteValue}
      onChange={(_, value: AutocompleteValue<T, OptBool, OptBool, OptBool>) => {
        onSelectedValue && onSelectedValue(value);
        setAutocompleteValue(value);
        setValue && setValue(name, value);
        setErrorAutoComplet(undefined);
      }}
      renderInput={(params) => {
        // https://medium.com/@justynazet/passing-props-to-props-children-using-react-cloneelement-and-render-props-pattern-896da70b24f6
        const removeClassNameElement = Children.map(
          params?.InputProps?.endAdornment,
          (child, i) => {
            return cloneElement(child as ReactElement<any>, {
              children: [
                <Box display="flex" px={1}>
                  {(isLoading || isShowLoading) && (
                    <Box px={1} pt={1}>
                      <CircularProgress color="primary" size={20} />
                    </Box>
                  )}
                  {isShowDeleteIcon && (
                    <IconButton
                      className="margin-autocomplete-Icon"
                      size="small"
                      onClick={() => {
                        onDelete && onDelete();
                      }}
                    >
                      <DeleteIcon color="secondary" fontSize="small" />
                    </IconButton>
                  )}
                  {isShowSearchIcon && <SearchIcon />}
                </Box>,
              ],
            });
          }
        );

        return (
          <Fragment>
            <TextField
              {...params}
              size="small"
              variant="outlined"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                subject.next(e.target.value);
                // !isShowAll && delayedHandleChange(e.target.value);
                freeSolo && setValue && setValue(name, e.target.value);
                onTextChange && onTextChange(e);
                e.target.value === '' && setValue && setValue(name, '');
              }}
              onKeyPress={(e) => validateLetters(e)}
              onClick={(e) => {
                onClick && onClick(e);
                if (!isShowAll) {
                  // delayedHandleChange('');
                  subject.next('');
                  setIsLoading(true);
                  setIsOpen(true);
                }
              }}
              error={errorAutoComplet ? !errorAutoComplet[name] : isValidate}
              helperText={
                (errorAutoComplet &&
                  (
                    Object.values(errorAutoComplet).first() as {
                      message: string;
                      ref: any;
                      type: string;
                    }
                  ).message) ??
                errorAutoComplet?.message
              }
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                startAdornment: isMultiple
                  ? params.InputProps.startAdornment
                  : frontIcon,
                endAdornment: (
                  <>
                    {removeClassNameElement
                      ? removeClassNameElement?.first()
                      : isShowSearchIcon && <SearchIcon />}
                  </>
                ),
              }}
            />
          </Fragment>
        );
      }}
    />
  );
};

// export const Autocomplete = memo(AutocompleteFC);
export const FormAutocomplete = withValidate(Autocomplete);
