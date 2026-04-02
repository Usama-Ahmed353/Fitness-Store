import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

/**
 * Dropdown Component
 */
const Dropdown = ({
  button,
  items = [],
  align = 'left',
  className = '',
  ...props
}) => {
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`} {...props}>
      {/* Trigger Button */}
      <Menu.Button className="flex items-center gap-2 hover:text-primary transition-colors">
        {button}
      </Menu.Button>

      {/* Dropdown Menu */}
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`
            absolute z-50 mt-2 w-48 rounded-lg
            bg-white shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          <div className="px-1 py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={`
                      w-full text-left px-4 py-2 rounded text-body
                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        active
                          ? 'bg-primary text-white'
                          : 'text-dark-navy hover:bg-gray-50'
                      }
                    `}
                  >
                    {item.icon && <item.icon className="inline mr-2 w-4 h-4" />}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
