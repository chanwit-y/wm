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
  callback?: Function;
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

  filterSelectedOptions?: boolean;

  disabled?: boolean;
  autoSelect?: boolean;

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
  validate?: boolean;
  placeholder?: string;
};

export const Autocomplete = <T extends any>({
  name,
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
  disabled = false,
  autoSelect,
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
  validate = false,
  filterSelectedOptions = true,
}: Props<T>) => {
  const [autocompleteValue, setAutocompleteValue] = useState<
    T | undefined | AutocompleteValue<T, OptBool, OptBool, OptBool>
  >(selectedValue ?? null);
  const [textField, setTextField] = useState(inputValue);
  const [options, setOptions] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [errorAutoComplet, setErrorAutoComplet] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const delayedHandleChange = debounce(
    (text: string) => callBackWithSetOptions(text),
    500
  );

  const validateLetters = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isLettersOnly) {
      if (!isEnglishLetters(e.key)) if (e.preventDefault) e.preventDefault();
    } else if (isEnglishOnly) {
      if (!isEnglishLettersWithNumbers(e.key))
        if (e.preventDefault) e.preventDefault();
    }
  };

  useEffect(() => {
    !open && !isShowAll && setOptions([]);
  }, [open]);

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
          const res = (await callback('', callbackParam)) as T[];
          setOptions(res);
        } else {
          setOptions(data ?? []);
        }
        setIsLoading(false);
      };
      getOptionData();
    }
  }, [isShowAll, data]);

  const callBackWithSetOptions = async (text: string) => {
    setOptions([]);

    let response: T[];
    setIsLoading(true);
    if (callbackParam) {
      response = callback && (await callback(text, callbackParam));
    } else {
      response = callback && (await callback(text, callbackParam));
    }
    response && setOptions(response);
    setIsLoading(false);
  };

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

  return (
    <MuiAutocomplete<T, OptBool, OptBool, OptBool>
      fullWidth
      freeSolo={freeSolo}
      filterSelectedOptions={filterSelectedOptions}
      openOnFocus
      forcePopupIcon={false}
      autoSelect={autoSelect}
      filterOptions={
        filterOptions
          ? (options, state) => {
              const optionsData = filterOptions(options, state);
              return optionsData;
            }
          : undefined
      }
      groupBy={groupBy}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      inputValue={textField}
      onInputChange={(_, newInputValue) => {
        setTextField(newInputValue);
      }}
      multiple={isMultiple}
      limitTags={limitTags}
      options={options}
      loading={isLoading}
      noOptionsText={'Data not found'}
      disabled={disabled}
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
                <Box key={i} display="flex" px={1}>
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
                !isShowAll && delayedHandleChange(e.target.value);
                freeSolo && setValue && setValue(name, e.target.value);
                onTextChange && onTextChange(e);
                e.target.value === '' && setValue && setValue(name, '');
              }}
              onKeyPress={(e) => validateLetters(e)}
              onClick={(e) => {
                onClick && onClick(e);
                if (!isShowAll) {
                  delayedHandleChange('');
                  setIsLoading(true);
                  setOpen(true);
                }
              }}
              error={errorAutoComplet ? !errorAutoComplet[name] : validate}
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
