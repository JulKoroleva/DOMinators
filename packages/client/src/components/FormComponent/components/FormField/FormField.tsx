import React, { useState } from 'react';
import { Controller, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import classNames from 'classnames';

import { Form } from 'react-bootstrap';

// import CloseIcon from '@/assets/icons/close.svg?react';
import { REQUIRED_FIELD_ERROR } from '@/constants/letters';

import { IFieldConfig, IFormFieldProps } from './FormField.interface';

import styles from './FormField.module.scss';
import { CirclePickerField } from '../CirclePickerField';

export const FormField = <T extends FieldValues>({
  field,
  control,
  getValues,
  trigger,
  clearErrors,
}: IFormFieldProps<T>) => {
  const { validation, isRequired } = field as IFieldConfig<T>;

  const validationRules = {
    ...(validation ? validation(getValues, trigger, clearErrors) : {}),
    ...(isRequired
      ? { required: { value: true, message: REQUIRED_FIELD_ERROR } }
      : { required: '' }),
  };

  const [isEyeVisible, setIsEyeVisible] = useState(false);

  const onFieldBlur =
    (fieldData: ControllerRenderProps<T, Path<T>>) => (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value) {
        const value = e.target.value.trimEnd();
        fieldData.onChange(value);
      }
    };

  const handleMouseDown = () => {
    setIsEyeVisible(true);
  };

  const handleMouseUp = () => {
    setIsEyeVisible(false);
  };

  return (
    <Form.Group
      className={classNames(styles['form-field'], { [styles['form-field-row']]: field.isInLine })}>
      {field.label && (
        <Form.Label className={styles['label']}>
          <div>
            {field.label}
            {field.isRequired && <span className={styles['required-star']}>*</span>}
          </div>
        </Form.Label>
      )}
      <div className={classNames({ [styles['form-field-main']]: field.isInLine })}>
        {field.type === 'file' && (
          <Controller
            name={field.id as Path<T>}
            control={control}
            rules={validationRules}
            render={({ field: fieldData, fieldState: { error } }) => {
              return (
                <>
                  <label className={styles['file-upload']}>
                    <input
                      type="file"
                      accept={field.accept}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          fieldData.onChange(file);
                        } else {
                          fieldData.onChange(null);
                        }
                      }}
                      name={field.id}
                      disabled={field.disabled}
                      className={styles['file-input']}
                    />
                  </label>
                  {fieldData.value && (
                    <div className={styles['file-name']}>
                      <span>{fieldData.value?.name}</span>
                      {/* <CloseIcon
                        className={styles['clear-file-icon']}
                        onClick={() => {
                          const inputElem = document.querySelector(
                            `input[name="${field.id}"]`,
                          ) as HTMLInputElement;
                          if (inputElem.files?.length) {
                            inputElem.value = '';
                          }
                          fieldData.onChange(null);
                        }}
                      /> */}
                    </div>
                  )}

                  {error && <div className={styles['error-message']}>{error.message}</div>}
                </>
              );
            }}
          />
        )}
        {field.type === 'text' && (
          <Controller
            name={field.id as Path<T>}
            control={control}
            rules={validationRules}
            render={({ field: fieldData, fieldState: { error } }) => {
              return (
                <>
                  <Form.Control
                    className={styles['input']}
                    placeholder={field?.placeholder ? field?.placeholder : ''}
                    type="text"
                    {...fieldData}
                    value={
                      (fieldData.value !== null
                        ? (field.upperCase
                            ? String(fieldData.value).toUpperCase()
                            : String(fieldData.value)
                          )?.trimStart()
                        : '') || ''
                    }
                    onChange={e => {
                      const value = e.target.value.trimStart();
                      fieldData.onChange(value === '' ? null : value);
                    }}
                    isInvalid={!!error}
                    disabled={field.disabled}
                    maxLength={field.maxLength}
                    onBlur={() => {
                      trigger(field.id as Path<T>);
                      onFieldBlur(fieldData);
                    }}
                  />
                  <Form.Control.Feedback type="invalid" className={styles['error-message']}>
                    {error?.message}
                  </Form.Control.Feedback>
                </>
              );
            }}
          />
        )}
        {field.type === 'password' && (
          <Controller
            name={field.id as Path<T>}
            control={control}
            rules={validationRules}
            render={({ field: fieldData, fieldState: { error } }) => {
              return (
                <>
                  <Form.Control
                    className={styles['input']}
                    placeholder={field?.placeholder ? field?.placeholder : ''}
                    type={!isEyeVisible ? 'password' : 'text'}
                    {...fieldData}
                    value={fieldData.value?.trimStart()?.trimEnd() || ''}
                    onChange={e => fieldData.onChange(e.target.value.trimStart().trimEnd())}
                    isInvalid={!!error}
                    disabled={field.disabled}
                    maxLength={field.maxLength}
                    onBlur={() => {
                      trigger(field.id as Path<T>);
                      onFieldBlur(fieldData);
                    }}
                  />
                  <button
                    className={classNames(styles['invisible-button'], {
                      [styles['eye-icon']]: isEyeVisible,
                      [styles['crossed-eye-icon']]: !isEyeVisible,
                    })}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                    onTouchCancel={handleMouseUp}
                    type="button"></button>
                  <Form.Control.Feedback type="invalid" className={styles['error-message']}>
                    {error?.message}
                  </Form.Control.Feedback>
                </>
              );
            }}
          />
        )}
        {field.type === 'textarea' && (
          <Controller
            name={field.id as Path<T>}
            control={control}
            rules={validationRules}
            render={({ field: fieldData, fieldState: { error } }) => {
              return (
                <>
                  <Form.Control
                    className={styles['textarea']}
                    placeholder={field?.placeholder ? field?.placeholder : ''}
                    type="textarea"
                    as="textarea"
                    {...fieldData}
                    value={
                      (fieldData.value !== null
                        ? (field.upperCase
                            ? String(fieldData.value).toUpperCase()
                            : String(fieldData.value)
                          )?.trimStart()
                        : '') || ''
                    }
                    onChange={e => {
                      const value = e.target.value.trimStart();
                      fieldData.onChange(value === '' ? null : value);
                    }}
                    isInvalid={!!error}
                    disabled={field.disabled}
                    maxLength={field.maxLength}
                    onBlur={() => {
                      trigger(field.id as Path<T>);
                      onFieldBlur(fieldData);
                    }}
                  />
                  <Form.Control.Feedback type="invalid" className={styles['error-message']}>
                    {error?.message}
                  </Form.Control.Feedback>
                </>
              );
            }}
          />
        )}
        {field.type === 'avatar' && (
          <CirclePickerField name={field.id as Path<T>} control={control} />
        )}
      </div>
    </Form.Group>
  );
};
