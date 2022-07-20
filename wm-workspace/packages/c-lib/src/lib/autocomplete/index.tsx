import '../../util/extension/Array.extension';
import {
  ChangeEvent,
  Children,
  cloneElement,
  Fragment,
  ReactElement,
  useEffect,
  useState,
  KeyboardEvent,
  SyntheticEvent,
} from 'react';
import {
  Autocomplete as MuiAutocomplete,
  CircularProgress,
  IconButton,
  TextField,
  Box,
} from '@mui/material';
import { get } from 'lodash';
import {
  isEnglishLetters,
  isEnglishLettersWithNumbers,
} from '../../util/RegExp';
import { withValidate } from '../../util/hoc/withValidate';
import { Observable, Subject, distinct, debounce, interval } from 'rxjs';
import { Props, OptBool, OperatorFunction } from './@types';

import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

export const Autocomplete = <T extends any>({
  name,
  subject,
  callback,
  // callbackParam,
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
  const [autocompleteValue, setAutocompleteValue] = useState<any>(
    selectedValue
  );
  const [textField, setTextField] = useState(inputValue);
  const [options, setOptions] = useState<T[]>([]);
  const [errorAutoComplet, setErrorAutoComplet] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      : setAutocompleteValue(undefined);
    const transform = transformValue && transformValue(selectedValue);
    setValue && setValue(name, transform ? transform : selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    if (isShowAll) {
      setOptions([]);
      const getOptionData = async () => {
        setOptions(data ?? []);
        setIsLoading(false);
      };
      getOptionData();
    }
  }, [isShowAll, data]);

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
    console.log('callback');
    callback &&
      callback().subscribe((res) => {
        setOptions(() => res);
        setIsLoading(false);
      });
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
          ? (options: T[], state: any) => {
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
      onInputChange={(
        _: SyntheticEvent<Element, Event>,
        newInputValue: string
      ) => setTextField(newInputValue)}
      multiple={isMultiple}
      limitTags={limitTags}
      options={options}
      loading={isLoading}
      noOptionsText={'Data not found'}
      disabled={isDisabled}
      getOptionLabel={optionLabel}
      renderOption={render}
      value={autocompleteValue}
      onChange={(_: SyntheticEvent<Element, Event>, value: any) => {
        onSelectedValue && onSelectedValue(value);
        setAutocompleteValue(value as T);
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
                freeSolo && setValue && setValue(name, e.target.value);
                onTextChange && onTextChange(e);
                e.target.value === '' && setValue && setValue(name, '');
              }}
              onKeyPress={(e: KeyboardEvent<HTMLDivElement>) =>
                validateLetters(e)
              }
              onClick={(e: any) => {
                onClick && onClick(e);
                if (!isShowAll) {
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

export const autoCompleteAPI = (
  suject: Subject<string>,
  op: OperatorFunction<string, any>
): Observable<unknown> => {
  return suject.pipe(
    debounce(() => interval(500)),
    distinct(),
    op
  );
};
