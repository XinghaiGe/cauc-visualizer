
// 定义全局变量
let currentAlgorithm = 'selectionSort'; // 当前选择的算法
let steps = []; // 存储所有算法步骤的数组
let currentStepIndex = 0; // 当前步骤的索引
let chart = null; // CanvasJS 图表实例
let animationInterval = null; // 动画定时器

// 获取DOM元素
const algorithmSelect = document.getElementById('algorithm-select');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const stopButton = document.getElementById('stop-button');
const codeDisplay = document.getElementById('code-display');
const currentStepNumberSpan = document.getElementById('current-step-number');
const totalStepsSpan = document.getElementById('total-steps');
const stepDescriptionSpan = document.getElementById('step-description');
const chartContainer = document.getElementById('chart-container');

// 原始数组，用于重置
let initialArray = [9, 2, 7, 5, 1, 8, 3, 10, 4, 6];

document.getElementById('submit-button').addEventListener('click', () => {
    initialArray = document.getElementById('input-data').value.split(',').map(Number);
    initialize();
})

// 存储算法代码，用于高亮显示
const algorithmCodes = {
    selectionSort: `
function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    return arr;
}
            `,
    bubbleSort: `
function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
            `,
    insertionSort: `
function insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}
            `,
    mergeSort: `
function mergeSort(arr) {
    if (arr.length > 1) {
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);

        mergeSort(left);
        mergeSort(right);

        let i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                arr[k] = left[i];
                i++;
            } else {
                arr[k] = right[j];
                j++;
            }
            k++;
        }

        while (i < left.length) {
            arr[k] = left[i];
            i++;
            k++;
        }

        while (j < right.length) {
            arr[k] = right[j];
            j++;
            k++;
        }
    }
    return arr;
}
            `,
    bucketSort: `
function bucketSort(arr) {
    const n = arr.length;
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const bucketSize = 5; // 桶的大小（可根据实际情况调整）
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = new Array(bucketCount).fill(null).map(() => []);

    for (let i = 0; i < n; i++) {
        const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
        buckets[bucketIndex].push(arr[i]);
    }

    for (let i = 0; i < bucketCount; i++) {
        buckets[i].sort((a, b) => a - b);
    }

    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            arr[index++] = buckets[i][j];
        }
    }
    return arr;
}
            `,
    countingSort: `
function countingSort(arr) {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const countArray = new Array(range).fill(0);

    for (let num of arr) {
        countArray[num - min]++;
    }

    let index = 0;
    for (let i = 0; i < range; i++) {
        while (countArray[i] > 0) {
            arr[index++] = i + min;
            countArray[i]--;
        }
    }
    return arr;
}
            `,
    radixSort: `
function radixSort(arr) {
    const getDigit = (num, pos) => Math.floor(Math.abs(num) / Math.pow(10, pos)) % 10;
    const maxDigit = Math.max(...arr).toString().length;

    for (let pos = 0; pos < maxDigit; pos++) {
        const buckets = Array.from({ length: 10 }, () => []);
        for (let num of arr) {
            const digit = getDigit(num, pos);
            buckets[digit].push(num);
        }
        arr = [].concat(...buckets);
    }
    return arr;
}
            `,
    shellSort: `
function shellSort(arr) {
    let n = arr.length;
    // 初始化增量序列，通常使用Knuth序列或其他
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        // 对每个增量进行插入排序
        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j;
            // 插入排序的内循环
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap]; // 元素后移
            }
            arr[j] = temp; // 插入元素
        }
    }
    return arr;
}
            `,
    heapSort: `
function heapSort(arr) {
    let n = arr.length;

    // 构建最大堆 (从最后一个非叶子节点开始)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // 一个个地从堆顶取出元素
    for (let i = n - 1; i > 0; i--) {
        // 将当前堆顶（最大元素）与末尾元素交换
        [arr[0], arr[i]] = [arr[i], arr[0]];
        // 对剩余的堆进行堆化
        heapify(arr, i, 0);
    }
    return arr;
}

// 堆化函数
function heapify(arr, n, i) {
    let largest = i; // 初始化最大元素为根
    let left = 2 * i + 1; // 左子节点
    let right = 2 * i + 2; // 右子节点

    // 如果左子节点比根大
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    // 如果右子节点比目前最大元素大
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    // 如果最大元素不是根
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]]; // 交换
        // 递归堆化受影响的子树
        heapify(arr, n, largest);
    }
}
            `,
    quickSort: `
function quickSort(arr, low, high) {
    if (low < high) {
        // 找到基准的正确位置
        let pi = partition(arr, low, high);

        // 递归对左右两部分进行排序
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

// 分区函数
function partition(arr, low, high) {
    let pivot = arr[high]; // 选择最后一个元素作为基准
    let i = (low - 1); // 小于基准的元素的索引

    for (let j = low; j < high; j++) {
        // 如果当前元素小于或等于基准
        if (arr[j] <= pivot) {
            i++;
            // 交换 arr[i] 和 arr[j]
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // 将基准元素放到正确的位置
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1; // 返回基准的索引
}
            `
};
// 颜色定义
const BAR_COLOR_DEFAULT = '#a0aec0'; // 默认灰色
const BAR_COLOR_COMPARING = '#fcd34d'; // 黄色
const BAR_COLOR_SWAPPING = '#f97316'; // 橙色
const BAR_COLOR_PIVOT = '#dc2626'; // 红色 (快速排序基准)
const BAR_COLOR_SORTED = '#34d399'; // 绿色 (已排序元素)

/**
 * 记录算法执行的每一步状态
 * @param {Array<number>} currentArray - 当前数组的副本
 * @param {string} description - 当前操作的描述
 * @param {Array<number>} highlightLines - 需要高亮的代码行号数组 (从1开始)
 * @param {Array<string>} barColors - 对应每个柱子的颜色数组
 */
function recordStep(currentArray, description, highlightLines = [], barColors = []) {
    steps.push({
        array: [...currentArray], // 确保是数组的深拷贝
        description: description,
        highlightLines: highlightLines,
        barColors: barColors.length > 0 ? [...barColors] : Array(currentArray.length).fill(BAR_COLOR_DEFAULT)
    });
}

/**
 * 选择排序算法实现，并记录每一步
 * @param {Array<number>} arr - 待排序数组
 */
function selectionSortAlgorithm(arr) {
    const n = arr.length;
    recordStep(arr, "开始选择排序", [1, 2], Array(n).fill(BAR_COLOR_DEFAULT));

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        recordStep(arr, `寻找第 ${i + 1} 轮最小元素 (当前最小索引: ${minIndex})`, [3], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === minIndex? BAR_COLOR_COMPARING : c));
        for (let j = i + 1; j < n; j++) {
            recordStep(arr, `比较 ${arr[j]} 和 ${arr[minIndex]}`, [5], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j || idx === minIndex)? BAR_COLOR_COMPARING : c));
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
                recordStep(arr, `更新最小索引为 ${minIndex}`, [6], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === minIndex? BAR_COLOR_COMPARING : c));
            }
        }
        recordStep(arr, `交换 ${arr[i]} 和 ${arr[minIndex]}`, [8], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === i || idx === minIndex)? BAR_COLOR_SWAPPING : c));
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        recordStep(arr, `交换完成，元素 ${arr[i]} 已排序`, [8], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx <= i? BAR_COLOR_SORTED : c));
    }
    recordStep(arr, "选择排序完成", [9], Array(n).fill(BAR_COLOR_SORTED));
}

/**
 * 冒泡排序算法实现，并记录每一步
 * @param {Array<number>} arr - 待排序数组
 */
function bubbleSortAlgorithm(arr) {
    const n = arr.length;
    recordStep(arr, "开始冒泡排序", [1, 2], Array(n).fill(BAR_COLOR_DEFAULT));

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            recordStep(arr, `比较 ${arr[j]} 和 ${arr[j + 1]}`, [4], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j || idx === j + 1)? BAR_COLOR_COMPARING : c));
            if (arr[j] > arr[j + 1]) {
                recordStep(arr, `交换 ${arr[j]} 和 ${arr[j + 1]}`, [6], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j || idx === j + 1)? BAR_COLOR_SWAPPING : c));
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                recordStep(arr, `交换完成`, [6], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j || idx === j + 1)? BAR_COLOR_SWAPPING : c));
            }
        }
        recordStep(arr, `第 ${i + 1} 轮冒泡完成，最大元素已移到末尾`, [8], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx >= n - i - 1? BAR_COLOR_SORTED : c));
    }
    recordStep(arr, "冒泡排序完成", [9], Array(n).fill(BAR_COLOR_SORTED));
}

/**
 * 插入排序算法实现，并记录每一步
 * @param {Array<number>} arr - 待排序数组
 */
function insertionSortAlgorithm(arr) {
    const n = arr.length;
    recordStep(arr, "开始插入排序", [1, 2], Array(n).fill(BAR_COLOR_DEFAULT));

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        recordStep(arr, `将元素 ${key} (索引 ${i}) 插入到已排序部分`, [3], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === i? BAR_COLOR_COMPARING : c));
        while (j >= 0 && arr[j] > key) {
            recordStep(arr, `比较 ${arr[j]} 和 ${key}`, [5], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j || idx === i)? BAR_COLOR_COMPARING : c));
            arr[j + 1] = arr[j];
            recordStep(arr, `元素 ${arr[j]} (索引 ${j}) 后移到索引 ${j + 1}`, [6], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === j + 1? BAR_COLOR_SWAPPING : c));
            j--;
        }
        arr[j + 1] = key;
        recordStep(arr, `将 ${key} 插入到索引 ${j + 1}`, [8], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === j + 1? BAR_COLOR_SWAPPING : c));
    }
    recordStep(arr, "插入排序完成", [9], Array(n).fill(BAR_COLOR_SORTED));
}

/**
 * 归并排序算法实现，并记录每一步
 * @param {Array<number>} arr - 待排序数组
 */
function mergeSortAlgorithm(arr) {
    if (arr.length > 1) {
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);

        recordStep(arr, `分割数组为左子数组 [${left}] 和右子数组 [${right}]`, [3], Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx < mid? BAR_COLOR_COMPARING : BAR_COLOR_DEFAULT));
        mergeSortAlgorithm(left);
        mergeSortAlgorithm(right);

        let i = 0, j = 0, k = 0;
        recordStep(arr, "合并左子数组和右子数组", [5], Array(arr.length).fill(BAR_COLOR_DEFAULT));
        while (i < left.length && j < right.length) {
            recordStep(arr, `比较 ${left[i]} 和 ${right[j]}`, [7], Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === k? BAR_COLOR_COMPARING : c)));
            if (left[i] < right[j]) {
                arr[k] = left[i];
                i++;
                recordStep(arr, `${left[i - 1]} 较小，放入数组`, [8], Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === k? BAR_COLOR_SWAPPING : c));
            } else {
                arr[k] = right[j];
                j++;
                recordStep(arr, `${right[j - 1]} 较小，放入数组`, [8], Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === k? BAR_COLOR_SWAPPING : c));
            }
            k++;
        }

        while (i < left.length) {
            arr[k] = left[i];
            i++;
            k++;
            recordStep(arr, `将剩余左子数组元素 ${left[i - 1]} 放入数组`, [10], Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === k - 1? BAR_COLOR_SWAPPING : c));
        }

        while (j < right.length) {
            arr[k] = right[j];
            j++;
            k++;
            recordStep(arr, `将剩余右子数组元素 ${right[j - 1]} 放入数组`, [10], Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === k - 1? BAR_COLOR_SWAPPING : c));
        }
    }
    if (arr.length === 1) {
        recordStep(arr, `单个元素 ${arr[0]} 视为已排序`, [11], Array(arr.length).fill(BAR_COLOR_SORTED));
    } else if (arr.length > 1) {
        recordStep(arr, `数组 [${arr}] 合并完成`, [12], Array(arr.length).fill(BAR_COLOR_DEFAULT));
    }
    if (arr.length === initialArray.length && isSorted(arr)) {
        recordStep(arr, "归并排序完成", [13], Array(arr.length).fill(BAR_COLOR_SORTED));
    }
}

// 辅助函数：检查数组是否已排序
function isSorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
    }
    return true;
}

/**
 * 桶排序算法实现，并记录每一步
 * @param {Array<number>} arr - 待排序数组
 */
function bucketSortAlgorithm(arr) {
    const n = arr.length;
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const bucketSize = 5; // 桶大小（可调整）
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = new Array(bucketCount).fill(null).map(() => []);

    recordStep(arr, "开始桶排序", [1, 2], Array(n).fill(BAR_COLOR_DEFAULT));
    recordStep(arr, `创建 ${bucketCount} 个桶，桶大小为 ${bucketSize}`, [3], Array(n).fill(BAR_COLOR_DEFAULT));

    for (let i = 0; i < n; i++) {
        const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
        recordStep(arr, `将 ${arr[i]} 放入桶 ${bucketIndex}`, [5], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === i? BAR_COLOR_SWAPPING : c));
        buckets[bucketIndex].push(arr[i]);
    }

    for (let i = 0; i < bucketCount; i++) {
        recordStep(arr, `对桶 ${i} [${buckets[i]}] 进行排序`, [7], Array(n).fill(BAR_COLOR_DEFAULT));
        buckets[i].sort((a, b) => a - b);
    }

    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            recordStep(arr, `将桶 ${i} 中的 ${buckets[i][j]} 放回原数组`, [9], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === index? BAR_COLOR_SWAPPING : c));
            arr[index++] = buckets[i][j];
        }
    }
    recordStep(arr, "桶排序完成", [10], Array(n).fill(BAR_COLOR_SORTED));
}

/**
 * 基数排序算法实现，并记录每一步
 * @param {Array<number>} arr - 待排序数组
 */
function radixSortAlgorithm(arr) {
    const getDigit = (num, pos) => Math.floor(Math.abs(num) / Math.pow(10, pos)) % 10;
    const maxDigit = Math.max(...arr).toString().length;

    recordStep(arr, "开始基数排序", [1, 2], Array(arr.length).fill(BAR_COLOR_DEFAULT));
    recordStep(arr, `最大位数: ${maxDigit}`, [3], Array(arr.length).fill(BAR_COLOR_DEFAULT));

    for (let pos = 0; pos < maxDigit; pos++) {
        const buckets = Array.from({ length: 10 }, () => []);
        recordStep(arr, `按第 ${pos} 位数字分配到桶`, [5], Array(arr.length).fill(BAR_COLOR_DEFAULT));
        for (let num of arr) {
            const digit = getDigit(num, pos);
            recordStep(arr, `数字 ${num} 的第 ${pos} 位: ${digit}`, [7], Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === arr.indexOf(num)? BAR_COLOR_COMPARING : c));
            buckets[digit].push(num);
        }
        recordStep(arr, `收集桶中的元素`, [9], Array(arr.length).fill(BAR_COLOR_DEFAULT));
        arr = [].concat(...buckets);
    }
    recordStep(arr, "基数排序完成", [10], Array(arr.length).fill(BAR_COLOR_SORTED));
}

/**
 * 计数排序算法实现，并记录每一步
 * @param {Array<number>} arr - 待排序数组
 */
function countingSortAlgorithm(arr) {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const countArray = new Array(range).fill(0);

    recordStep(arr, "开始计数排序", [1, 2], Array(arr.length).fill(BAR_COLOR_DEFAULT));
    recordStep(arr, `创建计数数组，范围 [${min}, ${max}]`, [3], Array(arr.length).fill(BAR_COLOR_DEFAULT));

    for (let num of arr) {
        recordStep(arr, `统计 ${num} 的出现次数`, [5], Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === arr.indexOf(num)? BAR_COLOR_COMPARING : c));
        countArray[num - min]++;
    }

    let index = 0;
    for (let i = 0; i < range; i++) {
        while (countArray[i] > 0) {
            recordStep(arr, `将 ${i + min} 放回原数组`, [7], Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === index? BAR_COLOR_SWAPPING : c));
            arr[index++] = i + min;
            countArray[i]--;
        }
    }
    recordStep(arr, "计数排序完成", [8], Array(arr.length).fill(BAR_COLOR_SORTED));
}



/**
 * 希尔排序算法实现，并记录每一步
 * @param {Array<number>} arr - 待排序数组
 */
function shellSortAlgorithm(arr) {
    let n = arr.length;
    recordStep(arr, "开始希尔排序", [1, 2], Array(n).fill(BAR_COLOR_DEFAULT));

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        recordStep(arr, `当前增量: ${gap}`, [3], Array(n).fill(BAR_COLOR_DEFAULT));
        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j;
            recordStep(arr, `将元素 ${temp} (索引 ${i}) 插入到增量为 ${gap} 的子序列中`, [5, 6], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === i ? BAR_COLOR_COMPARING : c));
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                recordStep(arr, `比较 ${arr[j - gap]} 和 ${temp}`, [8], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j - gap || idx === i) ? BAR_COLOR_COMPARING : c));
                arr[j] = arr[j - gap];
                recordStep(arr, `元素 ${arr[j]} (索引 ${j - gap}) 后移到索引 ${j}`, [9], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === j ? BAR_COLOR_SWAPPING : c));
            }
            arr[j] = temp;
            recordStep(arr, `将 ${temp} 插入到索引 ${j}`, [11], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === j ? BAR_COLOR_SWAPPING : c));
        }
    }
    recordStep(arr, "希尔排序完成", [12], Array(n).fill(BAR_COLOR_SORTED));
}

/**
 * 堆排序算法实现，并记录每一步
 * @param {Array<number>} arr - 待排序数组
 */
function heapSortAlgorithm(arr) {
    let n = arr.length;
    recordStep(arr, "开始堆排序", [1, 2], Array(n).fill(BAR_COLOR_DEFAULT));

    // 构建最大堆
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        recordStep(arr, `构建堆: 对子树 ${i} 进行堆化`, [4], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === i ? BAR_COLOR_COMPARING : c));
        heapify(arr, n, i);
    }
    recordStep(arr, "最大堆构建完成", [5], Array(n).fill(BAR_COLOR_DEFAULT));

    // 一个个地从堆顶取出元素
    for (let i = n - 1; i > 0; i--) {
        recordStep(arr, `将堆顶元素 ${arr[0]} 与末尾元素 ${arr[i]} 交换`, [8], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === 0 || idx === i) ? BAR_COLOR_SWAPPING : c));
        [arr[0], arr[i]] = [arr[i], arr[0]];
        recordStep(arr, `交换完成，元素 ${arr[i]} 已排序`, [8], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx > i ? BAR_COLOR_SORTED : (idx === i ? BAR_COLOR_SORTED : c)));

        recordStep(arr, `对剩余 ${i} 个元素的堆进行堆化`, [10], Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx > i ? BAR_COLOR_SORTED : c));
        heapify(arr, i, 0);
    }
    recordStep(arr, "堆排序完成", [11], Array(n).fill(BAR_COLOR_SORTED));
}

/**
 * 堆化函数，记录每一步
 * @param {Array<number>} arr - 数组
 * @param {number} n - 堆的大小
 * @param {number} i - 根节点索引
 */
function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    let colors = Array(arr.length).fill(BAR_COLOR_DEFAULT);
    for (let k = n; k < arr.length; k++) colors[k] = BAR_COLOR_SORTED; // 标记已排序部分

    recordStep(arr, `堆化: 根节点 ${arr[i]} (索引 ${i})`, [15], colors.map((c, idx) => idx === i ? BAR_COLOR_COMPARING : c));

    if (left < n) {
        recordStep(arr, `堆化: 比较根节点 ${arr[largest]} 和左子节点 ${arr[left]}`, [19], colors.map((c, idx) => (idx === largest || idx === left) ? BAR_COLOR_COMPARING : c));
        if (arr[left] > arr[largest]) {
            largest = left;
            recordStep(arr, `堆化: 左子节点 ${arr[left]} 更大`, [20], colors.map((c, idx) => idx === largest ? BAR_COLOR_COMPARING : c));
        }
    }

    if (right < n) {
        recordStep(arr, `堆化: 比较当前最大 ${arr[largest]} 和右子节点 ${arr[right]}`, [24], colors.map((c, idx) => (idx === largest || idx === right) ? BAR_COLOR_COMPARING : c));
        if (arr[right] > arr[largest]) {
            largest = right;
            recordStep(arr, `堆化: 右子节点 ${arr[right]} 更大`, [25], colors.map((c, idx) => idx === largest ? BAR_COLOR_COMPARING : c));
        }
    }

    if (largest !== i) {
        recordStep(arr, `堆化: 交换 ${arr[i]} 和 ${arr[largest]}`, [29], colors.map((c, idx) => (idx === i || idx === largest) ? BAR_COLOR_SWAPPING : c));
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        recordStep(arr, `堆化: 交换完成`, [29], colors.map((c, idx) => (idx === i || idx === largest) ? BAR_COLOR_SWAPPING : c));
        heapify(arr, n, largest);
    }
}

/**
 * 快速排序算法实现，并记录每一步
 * @param {Array<number>} arr - 待排序数组
 * @param {number} low - 数组的起始索引
 * @param {number} high - 数组的结束索引
 * @param {Array<string>} initialColors - 初始颜色数组，用于递归调用时传递已排序部分的颜色
 */
function quickSortAlgorithm(arr, low, high, initialColors = []) {
    if (low === undefined) low = 0;
    if (high === undefined) high = arr.length - 1;

    if (initialColors.length === 0) {
        recordStep(arr, "开始快速排序", [1, 2], Array(arr.length).fill(BAR_COLOR_DEFAULT));
    }

    if (low < high) {
        recordStep(arr, `对子数组 [${low}, ${high}] 进行分区`, [3], initialColors.length > 0 ? initialColors : Array(arr.length).fill(BAR_COLOR_DEFAULT));
        let pi = partition(arr, low, high, initialColors);

        let currentColors = steps[steps.length - 1].barColors; // 获取partition后的颜色状态
        recordStep(arr, `基准元素 ${arr[pi]} 位于正确位置 (索引 ${pi})`, [4], currentColors.map((c, idx) => idx === pi ? BAR_COLOR_SORTED : c));

        quickSortAlgorithm(arr, low, pi - 1, currentColors); // 递归左侧
        quickSortAlgorithm(arr, pi + 1, high, currentColors); // 递归右侧
    } else if (low === high) {
        // 单个元素，视为已排序
        let currentColors = steps.length > 0 ? steps[steps.length - 1].barColors : Array(arr.length).fill(BAR_COLOR_DEFAULT);
        recordStep(arr, `元素 ${arr[low]} (索引 ${low}) 视为已排序`, [3], currentColors.map((c, idx) => idx === low ? BAR_COLOR_SORTED : c));
    }

    if (low === 0 && high === arr.length - 1 && arr.every((_, i) => steps[steps.length - 1].barColors[i] === BAR_COLOR_SORTED)) {
        recordStep(arr, "快速排序完成", [6], Array(arr.length).fill(BAR_COLOR_SORTED));
    }
}

/**
 * 快速排序分区函数，记录每一步
 * @param {Array<number>} arr - 数组
 * @param {number} low - 起始索引
 * @param {number} high - 结束索引
 * @param {Array<string>} initialColors - 初始颜色数组
 * @returns {number} 基准元素最终位置的索引
 */
function partition(arr, low, high, initialColors) {
    let pivot = arr[high];
    let i = (low - 1);

    let colors = initialColors.length > 0 ? [...initialColors] : Array(arr.length).fill(BAR_COLOR_DEFAULT);
    colors[high] = BAR_COLOR_PIVOT; // 标记基准
    recordStep(arr, `选择 ${pivot} (索引 ${high}) 作为基准`, [11], colors);

    for (let j = low; j < high; j++) {
        colors = initialColors.length > 0 ? [...initialColors] : Array(arr.length).fill(BAR_COLOR_DEFAULT);
        colors[high] = BAR_COLOR_PIVOT; // 标记基准
        colors[j] = BAR_COLOR_COMPARING; // 标记当前比较元素
        if (i >= low) colors[i] = BAR_COLOR_COMPARING; // 标记i的位置

        recordStep(arr, `比较元素 ${arr[j]} (索引 ${j}) 和基准 ${pivot}`, [16], colors);

        if (arr[j] <= pivot) {
            i++;
            colors[i] = BAR_COLOR_SWAPPING; // 标记i的位置
            colors[j] = BAR_COLOR_SWAPPING; // 标记j的位置
            recordStep(arr, `元素 ${arr[j]} 小于或等于基准，交换 ${arr[i]} 和 ${arr[j]}`, [18, 20], colors);
            [arr[i], arr[j]] = [arr[j], arr[i]];
            recordStep(arr, `交换完成`, [20], colors);
        }
    }

    colors = initialColors.length > 0 ? [...initialColors] : Array(arr.length).fill(BAR_COLOR_DEFAULT);
    colors[high] = BAR_COLOR_SWAPPING; // 标记基准
    colors[i + 1] = BAR_COLOR_SWAPPING; // 标记i+1的位置
    recordStep(arr, `将基准 ${pivot} 交换到正确位置 (索引 ${i + 1})`, [24], colors);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    recordStep(arr, `基准放置完成`, [24], colors);

    return i + 1;
}

/**
 * 初始化或重置可视化系统
 */
function initialize() {
    stopAnimation(); // 停止任何正在进行的动画
    steps = []; // 清空步骤
    currentStepIndex = 0; // 重置步骤索引

    const arrayCopy = [...initialArray]; // 使用原始数组的副本

    // 根据选择的算法预计算所有步骤
switch (currentAlgorithm) {
        case'selectionSort':
            selectionSortAlgorithm(arrayCopy);
            break;
        case 'bubbleSort':
            bubbleSortAlgorithm(arrayCopy);
            break;
        case 'insertionSort':
            insertionSortAlgorithm(arrayCopy);
            break;
        case 'quickSort':
            quickSortAlgorithm(arrayCopy);
            break;
        case'mergeSort':
            mergeSortAlgorithm(arrayCopy);
            break;
        case 'bucketSort':
            bucketSortAlgorithm(arrayCopy);
            break;
        case 'countingSort':
            countingSortAlgorithm(arrayCopy);
            break;
        case 'radixSort':
            radixSortAlgorithm(arrayCopy);
            break;
        case'shellSort':
            shellSortAlgorithm(arrayCopy);
            break;
        case 'heapSort':
            heapSortAlgorithm(arrayCopy);
            break;
        default:
            console.error('无效的排序算法');
    }

    totalStepsSpan.textContent = steps.length; // 更新总步骤数
    updateVisualization(); // 更新显示
}

/**
 * 更新可视化界面（代码高亮、步骤信息、图表）
 */
function updateVisualization() {
    if (steps.length === 0) {
        // 如果没有步骤，清空显示
        currentStepNumberSpan.textContent = 0;
        stepDescriptionSpan.textContent = "请选择算法并点击重置";
        codeDisplay.innerHTML = "";
        if (chart) chart.destroy();
        chart = null;
        return;
    }

    const currentStepData = steps[currentStepIndex];

    // 更新步骤信息
    currentStepNumberSpan.textContent = currentStepIndex + 1;
    stepDescriptionSpan.textContent = currentStepData.description;

    // 更新代码高亮
    highlightCode(currentStepData.highlightLines);

    // 更新图表
    renderChart(currentStepData.array, currentStepData.barColors);

    // 控制按钮的启用/禁用状态
    prevButton.disabled = currentStepIndex === 0;
    nextButton.disabled = currentStepIndex === steps.length - 1;
    // stopButton.disabled = animationInterval === null; // 只有在动画运行时才启用停止按钮
}

/**
 * 高亮显示指定行号的代码
 * @param {Array<number>} linesToHighlight - 需要高亮的代码行号数组
 */
function highlightCode(linesToHighlight) {
    // 获取当前算法的原始代码
    const rawCode = algorithmCodes[currentAlgorithm];
    // 移除注释并分割成行
    const displayLines = rawCode.split('\n').map(line => {
        // 简单的正则匹配，移除行尾的单行注释
        let cleanedLine = line.replace(/\/\/.*$/, '').trimEnd();
        // 移除多行注释的开始和结束标记，以及行内注释
        cleanedLine = cleanedLine.replace(/\/\*[\s\S]*?\*\/|/g, '');
        return cleanedLine;
    }).filter(line => line.trim() !== ''); // 过滤掉空行

    let html = '';
    displayLines.forEach((line, index) => {
        // 原始代码行号与显示行号的映射
        // 这是一个简化的处理，实际中需要更精确的映射，因为注释行被移除了。
        // 为了简单，这里直接使用显示行号作为高亮依据，这可能与原始行号不完全对应。
        // 用户看到的是无注释的代码，高亮是基于这些无注释行的索引。
        const isHighlighted = linesToHighlight.includes(index + 1); // +1 因为行号从1开始
        html += `<div class="code-line ${isHighlighted ? 'highlight' : ''}">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
    });
    codeDisplay.innerHTML = html;

    // 滚动到高亮行
    const highlightedElement = codeDisplay.querySelector('.highlight');
    if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * 使用CanvasJS渲染柱状图
 * @param {Array<number>} dataArray - 数组数据
 * @param {Array<string>} barColors - 柱子的颜色数组
 */
function renderChart(dataArray, barColors) {
    const chartData = dataArray.map((value, index) => ({
        y: value,
        label: value.toString(), // 在柱状图上显示数值
        color: barColors[index] || BAR_COLOR_DEFAULT
    }));

    if (chart) {
        // 如果图表已存在，更新数据
        chart.options.data[0].dataPoints = chartData;
        chart.render();
    } else {
        // 否则，创建新图表
        chart = new CanvasJS.Chart("chart-container", {
            animationEnabled: false, // 禁用CanvasJS内置动画，我们自己控制
            theme: "light2",
            title: {
                text: "数组状态"
            },
            axisY: {
                title: "数值",
                includeZero: true,
                maximum: 10, // 数组最大值是10
                interval: 1
            },
            axisX: {
                title: "索引"
            },
            data: [{
                type: "column", // 柱状图
                dataPoints: chartData,
                indexLabel: "{y}", // 显示柱子上的值
                indexLabelFontColor: "#333",
                indexLabelPlacement: "outside"
            }]
        });
        chart.render();
    }
}

/**
 * 停止动画（如果正在播放）
 */
function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
        stopButton.disabled = true;
    }
}

// 事件监听器
algorithmSelect.addEventListener('change', (event) => {
    currentAlgorithm = event.target.value;
    initialize();
});

startButton.addEventListener('click', () => {
    // 停止之前的动画（如果存在）
    stopAnimation();
    
    // 如果已经在最后一步，则重置到第一步
    if (currentStepIndex >= steps.length - 1) {
        currentStepIndex = 0;
        updateVisualization();
    }
    
    // 设置间隔1.5秒自动排序
    animationInterval = setInterval(() => {
        if (currentStepIndex < steps.length - 1) {
            currentStepIndex++;
            updateVisualization();
        } else {
            // 如果到达最后一步，停止动画
            stopAnimation();
        }
    }, 1500);
});
resetButton.addEventListener('click', () => {
    initialize();
});

prevButton.addEventListener('click', () => {
    stopAnimation(); // 手动操作时停止动画
    if (currentStepIndex > 0) {
        currentStepIndex--;
        updateVisualization();
    }
});

nextButton.addEventListener('click', () => {
    stopAnimation(); // 手动操作时停止动画
    if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        updateVisualization();
    }
});

stopButton.addEventListener('click', () => {
    stopAnimation();
});

// 页面加载完成后初始化
window.onload = () => {
    initialize();
};
