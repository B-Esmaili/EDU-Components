/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ElementClass, ElementType } from './types';
import useElement from './use-element';
import { PageContext } from './page-context';
import { act, render, waitFor } from '@testing-library/react';
import { Box } from 'grommet';
import './element-factory';
import { useEffect } from 'react';
import * as elemFactory from './element-factory';

jest.mock('./element-factory', () => {
  const originalModule = jest.requireActual('./element-factory');

  return {
    __esModule: true,
    ...originalModule,
    createElement: () => <div>element</div>,
    prepairElement: () => Promise.resolve(() => <div />),
  };
});

describe('use-element', () => {
  it('add element', async function () {
    const Page = ({ children }: { children: unknown }) => {
      return <PageContext>{children}</PageContext>;
    };

    const Element = () => {
      const el = useElement('root');

      const addElem = () =>
        el.addElement({
          codeName: 'simple',
          elementClass: ElementClass.Block,
          type: ElementType.FabricElement,
        });

      useEffect(() => {
        act(() => {
          addElem();
          addElem();
          addElem();
        });
      });

      return (
        <div>
          {el.childElements.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
          <Box role="list">{el.childElements.length}</Box>
        </div>
      );
    };

    const { getByRole } = render(
      <Page>
        <Element />
      </Page>
    );

    await waitFor(() => {
      expect(getByRole('list').innerHTML.trim()).toBe('3');
    });
  });

  it('insert element', async function () {
    const Page = ({ children }: { children: unknown }) => {
      return <PageContext>{children}</PageContext>;
    };

    const createElement = jest.spyOn(elemFactory, 'createElement');
    createElement.mockImplementation((element) => {
      return (
        <div data-testid="listitem">
          {(element.model as Record<string, unknown>)['index']
            ? 'inserted'
            : 'appended'}
        </div>
      );
    });

    const Element = () => {
      const el = useElement('root');

      const addElem = async (index?: number) =>
        await el.addElement(
          {
            codeName: 'simple',
            elementClass: ElementClass.Block,
            type: ElementType.FabricElement,
            model: { index },
          },
          index
        );

      useEffect(() => {
        (async () => {
          await act(() => {
            addElem();
            addElem();
            addElem(1);
          });
        })();
      });

      return (
        <div>
          {el.childElements.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
          <Box role="list">{el.childElements.length}</Box>
        </div>
      );
    };

    const { getAllByTestId } = render(
      <Page>
        <Element />
      </Page>
    );

    await waitFor(async () => {
      const items = getAllByTestId('listitem');
      if (items) {
        expect(items[1].innerHTML.trim()).toBe('inserted');
      }
    });
  });
});
