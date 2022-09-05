/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ElementClass, ElementType, PageElement } from './types';
import useElement from './use-element';
import { PageContext } from './page-context';
import { act, render, waitFor } from '@testing-library/react';
import { Box } from 'grommet';
import './element-factory';
import React, { useEffect } from 'react';
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

const Page = ({ children }: { children: unknown }) => {
  return <PageContext>{children}</PageContext>;
};

const mockCreateElement = (
  contentDisplay: (element: PageElement) => React.ReactNode
) => {
  const createElement = jest.spyOn(elemFactory, 'createElement');
  createElement.mockImplementation((element) => {
    return <div data-testid="listitem">{contentDisplay(element)}</div>;
  });
};

describe('use-element', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('add element', async function () {
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
    mockCreateElement((element) =>
      (element.model as Record<string, unknown>)['index']
        ? 'inserted'
        : 'appended'
    );

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
      expect(items.length).toBeGreaterThan(0);
      if (items) {
        expect(items[1].innerHTML.trim()).toBe('inserted');
      }
    });
  });

  it('move element', async function () {
    //@ts-ignore
    mockCreateElement((element) => element?.model?.content);

    const Element = () => {
      const el = useElement('root');
      const { moveElement } = el;

      const addElem = async (content: string) =>
        await el.addElement({
          codeName: 'simple',
          elementClass: ElementClass.Block,
          type: ElementType.FabricElement,
          model: { content },
        });

      useEffect(() => {
        (async () => {
          await act(() => {
            addElem('child1');
            addElem('child2');
            addElem('child3');
          });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      useEffect(() => {
        if (el.childElements.length === 3) {
          (async () => {
            await act(async () => {
              moveElement(0, 1);
            });
          })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [el.childElements.length]);

      return (
        <div>
          {el.childElements.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
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
      expect(items.length).toEqual(3);

      if (items) {
        expect(items[1].innerHTML.trim()).toBe('child1');
      }
    });
  });

  it('remove element', async () => {
    //@ts-ignore
    mockCreateElement((element) => element?.model?.content);

    const Element = () => {
      const el = useElement('root');

      const addElem = async (content: string) =>
        await el.addElement({
          codeName: 'simple',
          elementClass: ElementClass.Block,
          type: ElementType.FabricElement,
          model: { content },
        });

      useEffect(() => {
        (async () => {
          await act(() => {
            addElem('child1');
            addElem('child2');
            addElem('child3');
          });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      useEffect(() => {
        if (el.childElements.length === 3) {
          (async () => {
            await act(async () => {
              el.removeElement(2);
            });
          })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [el.childElements.length]);

      return (
        <div>
          {el.childElements.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      );
    };

    const { getAllByTestId } = render(
      <Page>
        <Element />
      </Page>
    );

    await waitFor(() => {
      const items = getAllByTestId('listitem');
      expect(items.length).toEqual(2);
    });
  });
});
