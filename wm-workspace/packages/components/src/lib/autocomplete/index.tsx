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
} from '@mui/material';
import {
  ChangeEvent,
  Children,
  cloneElement,
  FC,
  Fragment,
  memo,
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
import { withValidate } from '@wm-workspace/util';
// import {
//   isEnglishLetters,
//   isEnglishLettersWithNumbers,
// } from "../../Lib/Utils/RegExp";

type ValidateInsideArrayOption = {
  index: number;
  name: string;
  baseName: string;
};

type Props<T> = {
  name: string;
  callback?: Function;
  callbackParam?: unknown;
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

  // optionSelected?: (option: any, value: any) => boolean;

  optionLabel: (
    option: T | AutocompleteFreeSoloValueMapping<boolean | undefined>
  ) => string;
  render: (props: HTMLAttributes<HTMLLIElement>, option: T) => ReactNode;

  onTextChange?: (e: ChangeEvent<HTMLInputElement>) => void;

  onClick?: MouseEventHandler<HTMLDivElement>;
  onDelete?: Function;

  validateInsideArrayOption?: ValidateInsideArrayOption;

  errorName?: string;
  errors?: DeepMap<Record<string, any>, FieldError>;
  setValue?: UseFormSetValue<FieldValues>;

  selectedValue?: T;
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
  // optionSelected,
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
  const [autocompleteValue, setAutocompleteValue] = useState<T  | undefined | null>(
    selectedValue
  );
  const [textField, setTextField] = useState(inputValue);
  const [options, setOptions] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [errorAutoComplet, setErrorAutoComplet] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const delayedHandleChange = debounce(
    (text: string) => callBackWithSetOptions(text),
    500
  );

  const validateLetters = (evt: KeyboardEvent<HTMLDivElement>) => {
    //     if (isLettersOnly) {
    //       if (!isEnglishLetters(evt.key))
    //         if (evt.preventDefault) evt.preventDefault();
    //     } else if (isEnglishOnly) {
    //       if (!isEnglishLettersWithNumbers(evt.key))
    //         if (evt.preventDefault) evt.preventDefault();
    //     }
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
          return await callback('', callbackParam);
        }
      };

      const optionData = callback ? getOptionData() : data ? data : [];

      setOptions(optionData);
      setIsLoading(false);
    }
  }, [isShowAll, data]);

  const callBackWithSetOptions = async (text: string) => {
    setOptions([]);

    let response: unknown;
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

  return (
    <MuiAutocomplete<
      T,
      boolean | undefined,
      boolean | undefined,
      boolean | undefined
    >
      fullWidth
      freeSolo={freeSolo}
      filterSelectedOptions={filterSelectedOptions}
      openOnFocus
      // selectOnFocus
      // clearOnBlur
      forcePopupIcon={false}
      autoSelect={autoSelect}
      // disableClearable={isShowSearchIcon}
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
      // defaultValue={autocompletValue}
      onInputChange={(event, newInputValue) => {
        setTextField(newInputValue);
      }}
      multiple={isMultiple}
      limitTags={limitTags}
      options={options}
      loading={isLoading}
      // noOptionsText={(!isLoading && (options.isEmpty() || !isFilterFound)) && 'No Data'}
      noOptionsText={'Data not found'}
      disabled={disabled}
      // getOptionSelected={(option: any, value: any) => {
      //   let result = false;
      //   if (optionSelected) {
      //     result = optionSelected(option, value);
      //     errors && (errors[name] = undefined);
      //   }

      //   return result;
      // }}
      getOptionLabel={optionLabel}
      renderOption={render}
      value={autocompleteValue}
      onChange={(event: any, newValue: any) => {
        onSelectedValue && onSelectedValue(newValue);

        setAutocompleteValue(newValue);
        setValue && setValue(name, newValue);
        setErrorAutoComplet(undefined);
      }}
      renderInput={(params) => {
        // https://medium.com/@justynazet/passing-props-to-props-children-using-react-cloneelement-and-render-props-pattern-896da70b24f6
        const removeClassNameElement = Children.map(
          params?.InputProps?.endAdornment,
          (child, i) => {
            return cloneElement(child as ReactElement<any>, {
              children: [
                <div className="flex px-1">
                  {(isLoading || isShowLoading) && (
                    <div className="px-1 pt-1">
                      <CircularProgress color="primary" size={20} />
                    </div>
                  )}
                  {isShowDeleteIcon && (
                    <IconButton
                      className="margin-autocomplete-Icon"
                      size="small"
                      onClick={(e) => {
                        onDelete && onDelete();
                      }}
                    >
                      <DeleteIcon color="secondary" fontSize="small" />
                    </IconButton>
                  )}
                  {isShowSearchIcon && <SearchIcon />}
                </div>,
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
                // e.target.value === "" && setAutocompleteValue(null);
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
                endAdornment: <>{removeClassNameElement?.first()}</>,
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
