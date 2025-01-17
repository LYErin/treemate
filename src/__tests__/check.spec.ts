import { getExtendedCheckedKeySet } from '@/check'
import { createTreeMate } from '@/index'
import { RawNode } from '@/interface'

import {
  basicTree,
  cascadeDisabledTestTree,
  disabledNodeTestTree,
  extendedCheckedKeysTestTree
} from './check-data/index'
import { expectCheckedStatusSame, expectArrayEqual } from './test-utils/index'

describe('check', () => {
  describe('#getExtentedCheckedKeys', () => {
    ;[
      {
        checkedKeys: ['0'],
        extendedCheckedKeys: ['0', '0-0']
      },
      {
        checkedKeys: ['1'],
        extendedCheckedKeys: ['1']
      },
      {
        checkedKeys: ['0-1'],
        extendedCheckedKeys: ['0-1']
      },
      {
        checkedKeys: ['1-1'],
        extendedCheckedKeys: ['1-1', '1-1-0']
      },
      {
        checkedKeys: ['2', '2-1'],
        extendedCheckedKeys: ['2', '2-0', '2-1']
      }
    ].forEach((data, index) => {
      it('extended to all avaiabled children #' + String(index + 1), () => {
        const treeMate = createTreeMate(extendedCheckedKeysTestTree)
        const extendedCheckedKeySet = getExtendedCheckedKeySet(
          data.checkedKeys,
          treeMate
        )
        expectArrayEqual(
          Array.from(extendedCheckedKeySet),
          data.extendedCheckedKeys
        )
      })
    })
  })
  describe('#getCheckedKeys', () => {
    ;[
      {
        explain: 'check all available children',
        input: ['0-0'],
        output: {
          checkedKeys: ['0-0', '0-0-0', '0-0-0-0', '0-0-0-1', '0-0-1'],
          indeterminateKeys: ['0']
        },
        tree: basicTree
      },
      {
        explain: 'stop bubble on disabled parent',
        input: ['0-0-0'],
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'stop sink to disabled children',
        input: ['0'],
        output: {
          checkedKeys: ['0', '0-1', '0-1-0', '0-1-1'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'bubble on ascendant #1',
        input: ['0-1'],
        output: {
          checkedKeys: ['0', '0-1', '0-1-0', '0-1-1'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'bubble on ascendant #2',
        input: ['0-1-0'],
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: ['0', '0-1']
        },
        tree: disabledNodeTestTree
      },
      {
        explain: "doesn't affect other nodes if it's disabled",
        input: ['0-0'],
        output: {
          checkedKeys: ['0-0'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'input keys are null',
        input: null,
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'input keys are null',
        input: undefined,
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'check all available children (non-cascade)',
        cascade: false,
        input: ['0-0'],
        output: {
          checkedKeys: ['0-0'],
          indeterminateKeys: []
        },
        tree: basicTree
      },
      {
        explain: 'stop bubble on disabled parent (non-cascade)',
        cascade: false,
        input: ['0-0-0'],
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'stop sink to disabled children (non-cascade)',
        cascade: false,
        input: ['0'],
        output: {
          checkedKeys: ['0'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'bubble on ascendant #1 (non-cascade)',
        cascade: false,
        input: ['0-1'],
        output: {
          checkedKeys: ['0-1'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'bubble on ascendant #2 (non-cascade)',
        cascade: false,
        input: ['0-1-0'],
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: "doesn't affect other nodes if it's disabled (non-cascade)",
        cascade: false,
        input: ['0-0'],
        output: {
          checkedKeys: ['0-0'],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'input keys are null (non-cascade)',
        cascade: false,
        input: null,
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'input keys are null (non-cascade)',
        cascade: false,
        input: undefined,
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        },
        tree: disabledNodeTestTree
      },
      {
        explain: 'cascade disabled',
        cascade: true,
        input: ['1', '1-1'],
        output: {
          checkedKeys: ['1', '1-0', '1-1'],
          indeterminateKeys: []
        },
        tree: cascadeDisabledTestTree
      }
    ].forEach((testCase) => {
      it(testCase.explain, () => {
        const treeMate = createTreeMate<RawNode>(testCase.tree)
        expectCheckedStatusSame(
          treeMate.getCheckedKeys(testCase.input, {
            cascade: testCase.cascade
          }),
          testCase.output
        )
      })
    })
  })
  describe('#check', () => {
    ;[
      {
        explain: 'case1',
        checkedKeys: [],
        checkedKey: '0-0-0',
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (do nothing)',
        checkedKeys: [],
        checkedKey: undefined,
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (batch-check)',
        checkedKeys: [],
        checkedKey: ['0-0-0', '0-1-0'],
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1', '0-1-0'],
          indeterminateKeys: ['0', '0-1']
        }
      },
      {
        explain: 'case1 (leaf-only)',
        leafOnly: true,
        checkedKeys: [],
        checkedKey: '0-0-0',
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (no cascade)',
        cascade: false,
        checkedKeys: [],
        checkedKey: '0-0-0',
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (checkStrategy is parent)',
        checkStrategy: 'parent',
        checkedKeys: [],
        checkedKey: '0-0-0',
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (checkStrategy is child)',
        checkStrategy: 'child',
        checkedKeys: [],
        checkedKey: '0-0-0',
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (no cascade, dupe)',
        cascade: false,
        checkedKeys: ['0-0-0'],
        checkedKey: '0-0-0',
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2',
        checkedKeys: [],
        checkedKey: '0-1',
        output: {
          checkedKeys: ['0', '0-1', '0-1-0', '0-1-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2',
        leafOnly: true,
        checkedKeys: [],
        checkedKey: '0-1',
        output: {
          checkedKeys: ['0-1-0', '0-1-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2 (no cascade)',
        cascade: false,
        checkedKeys: [],
        checkedKey: '0-1',
        output: {
          checkedKeys: ['0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2 (checkStrategy is parent)',
        checkStrategy: 'parent',
        checkedKeys: [],
        checkedKey: '0-1',
        output: {
          checkedKeys: ['0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2 (checkStrategy is child)',
        checkStrategy: 'child',
        checkedKeys: [],
        checkedKey: '0-1',
        output: {
          checkedKeys: ['0-1-0', '0-1-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case3',
        checkedKeys: [],
        checkedKey: '0-1-0',
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: ['0', '0-1']
        }
      },
      {
        explain: 'case3 (leaf only)',
        leafOnly: true,
        checkedKeys: [],
        checkedKey: '0-1-0',
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: ['0', '0-1']
        }
      },
      {
        explain: 'case3 (no cascade)',
        cascade: false,
        checkedKeys: [],
        checkedKey: '0-1-0',
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case3 (checkStrategy is parent)',
        checkStrategy: 'parent',
        checkedKeys: [],
        checkedKey: '0-1-0',
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: ['0', '0-1']
        }
      },
      {
        explain: 'case3 (checkStrategy is child)',
        checkStrategy: 'child',
        checkedKeys: [],
        checkedKey: '0-1-0',
        output: {
          checkedKeys: ['0-1-0'],
          indeterminateKeys: ['0', '0-1']
        }
      },
      {
        explain: 'case4',
        checkedKeys: ['0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case4 (leaf only)',
        leafOnly: true,
        checkedKeys: ['0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case4 (no cascade)',
        cascade: false,
        checkedKeys: ['0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case4 (checkStrategy is parent)',
        checkStrategy: 'parent',
        checkedKeys: ['0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case4 (checkStrategy is child)',
        checkStrategy: 'child',
        checkedKeys: ['0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case5',
        checkedKeys: ['0-0', '0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0', '0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case5 (leaf only)',
        leafOnly: true,
        checkedKeys: ['0-0', '0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case5 (no cascade)',
        cascade: false,
        checkedKeys: ['0-0', '0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case5 (checkStrategy is parent)',
        checkStrategy: 'parent',
        checkedKeys: ['0-0', '0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0', '0-0-0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case5 (checkStrategy is child)',
        checkStrategy: 'child',
        checkedKeys: ['0-0', '0-0-0-0'],
        checkedKey: '0-0-0-1',
        output: {
          checkedKeys: ['0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (null)',
        checkedKeys: ['0-0-0'],
        checkedKey: null,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (null) (leaf only)',
        leafOnly: true,
        checkedKeys: ['0-0-0'],
        checkedKey: null,
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (null) (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0'],
        checkedKey: null,
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (undefined)',
        checkedKeys: ['0-0-0'],
        checkedKey: undefined,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (undefined) (leaf only)',
        leafOnly: true,
        checkedKeys: ['0-0-0'],
        checkedKey: undefined,
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (undefined) (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0'],
        checkedKey: undefined,
        output: {
          checkedKeys: ['0-0-0'],
          indeterminateKeys: []
        }
      }
    ].forEach((testCase) => {
      it(testCase.explain, () => {
        const treeMate = createTreeMate(disabledNodeTestTree)
        expectCheckedStatusSame(
          treeMate.check(testCase.checkedKey, testCase.checkedKeys, {
            cascade: testCase.cascade,
            leafOnly: testCase.leafOnly,
            checkStrategy: testCase.checkStrategy
          }),
          testCase.output
        )
        expectCheckedStatusSame(
          treeMate.check(
            testCase.checkedKey,
            {
              checkedKeys: testCase.checkedKeys,
              indeterminateKeys: testCase.cascade
                ? ['should be ingored']
                : undefined
            },
            {
              cascade: testCase.cascade,
              leafOnly: testCase.leafOnly,
              checkStrategy: testCase.checkStrategy
            }
          ),
          testCase.output
        )
      })
    })
  })
  describe('#uncheck', () => {
    ;[
      {
        explain: 'case1',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0',
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (leaf only)',
        leafOnly: true,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0',
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0',
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (checkStrategy is parent)',
        checkStrategy: 'parent',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0',
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (checkStrategy is child)',
        checkStrategy: 'child',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0',
        output: {
          checkedKeys: [],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case1 (non-cascade, non-exist keys)',
        cascade: false,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: ['0-0-0', '666'],
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0-0',
        output: {
          checkedKeys: ['0-0-0-1'],
          indeterminateKeys: ['0-0-0']
        }
      },
      {
        explain: 'case2 (leaf only)',
        leafOnly: true,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0-0',
        output: {
          checkedKeys: ['0-0-0-1'],
          indeterminateKeys: ['0-0-0']
        }
      },
      {
        explain: 'case2 (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0-0',
        output: {
          checkedKeys: ['0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'case2 (checkStrategy is parent)',
        checkStrategy: 'parent',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0-0',
        output: {
          checkedKeys: ['0-0-0-1'],
          indeterminateKeys: ['0-0-0']
        }
      },
      {
        explain: 'case2 (checkStrategy is child)',
        checkStrategy: 'child',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: '0-0-0-0',
        output: {
          checkedKeys: ['0-0-0-1'],
          indeterminateKeys: ['0-0-0']
        }
      },
      {
        explain: 'nullish input (null)',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: null,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (null) (leaf only)',
        leafOnly: true,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: null,
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (null) (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: null,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (undefined)',
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: undefined,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (undefined) (leaf only)',
        leafOnly: true,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: undefined,
        output: {
          checkedKeys: ['0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      },
      {
        explain: 'nullish input (undefined) (non-cascade)',
        cascade: false,
        checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
        uncheckedKey: undefined,
        output: {
          checkedKeys: ['0-0-0', '0-0-0-0', '0-0-0-1'],
          indeterminateKeys: []
        }
      }
    ].forEach((testCase) => {
      it(testCase.explain, () => {
        const treeMate = createTreeMate(disabledNodeTestTree)
        expectCheckedStatusSame(
          treeMate.uncheck(testCase.uncheckedKey, testCase.checkedKeys, {
            cascade: testCase.cascade,
            leafOnly: testCase.leafOnly,
            checkStrategy: testCase.checkStrategy
          }),
          testCase.output
        )
      })
    })
  })
})
