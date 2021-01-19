import {
  TreeNode
} from './interface'
import {
  isGroup
} from './utils'

export function flatten<R, G, E> (treeNodes: Array<TreeNode<R, G, E>>, flattenedNodes: Array<TreeNode<R, G, E>> = []): Array<TreeNode<R, G, E>> {
  treeNodes.forEach(treeNode => {
    flattenedNodes.push(treeNode)
    if (treeNode.isLeaf) {
    } else if (isGroup(treeNode.rawNode)) {
      flatten(treeNode.children as TreeNode[], flattenedNodes)
    } else {
      flatten(treeNode.children as TreeNode[], flattenedNodes)
    }
  })
  return flattenedNodes
}
