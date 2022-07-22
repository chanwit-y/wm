import {
  AutocompleteFreeSoloValueMapping,
  AutocompleteValue,
  FilterOptionsState,
} from '@mui/material';
import {
  ChangeEvent,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react';
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormSetValue,
} from 'react-hook-form';
import { Observable, Subject, UnaryFunction } from 'rxjs';

export type ValidateInsideArrayOption = {
  index: number;
  name: string;
  baseName: string;
};

export type OptBool = boolean | undefined;
// export type KeyValue = { [key: string]: any };

export interface OperatorFunction<T, R>
  extends UnaryFunction<Observable<T>, Observable<R>> {}

export type Props<T> = {
  name: string;
  // callback('text on input', callbackParam) { const {key} =  callbackParam; ...}
  subject: Subject<string>;
  callback?: () => Observable<any>; // Function;
  // parameter for callback function {"key": "value"}
//   callbackParam?: KeyValue;
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
