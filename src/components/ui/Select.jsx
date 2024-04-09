import {
  Select as DaisySelect
} from 'react-daisyui';

export function Select(props) {
  return (
    <>
      <DaisySelect
        className={props.className || ''}
        id={props.id || ''}
        value={props.value || ''}
        onChange={props.handleChange || ''}
        disabled={props.disabled}
      >  
        <DaisySelect.Option value={''} disabled>
          {''}
        </DaisySelect.Option>
        {props.options?.map((item, index) => {
          const useOptValue = item[props.optValue] || '';
          const useOptName = item[props.optName] || '';
          return (
            <DaisySelect.Option
              key={index}
              value={useOptValue}
            >
              {useOptName}
            </DaisySelect.Option>
          );
        })}
      </DaisySelect>                  
    </>
  )
}

export default Select;