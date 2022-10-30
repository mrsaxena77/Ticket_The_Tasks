import java.util.*;

public class sumArray {

    public static Scanner scn = new Scanner(System.in);

    public static int[] input2(int n) {

        int[] arr = new int[n];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = scn.nextInt();
        }
        return arr;
    }

    public static void add(int[] arr1, int[] arr2) {

        int a = arr1.length;
        int b = arr2.length;
        int c = Math.max(a, b) + 1;

        int[] ans = new int[c];

        int x = a - 1, y = b - 1, z = c - 1, carry = 0;

        while (z >= 0) {
            int sum = carry + (x >= 0 ? arr1[x] : 0) + (y >= 0 ? arr2[y] : 0);

            carry = sum / 10;
            ans[z] = sum % 10;

            x--;
            y--;
            z--;
        }
        for (int ele = 0; ele < c; ele++) {
            if (ele == 0 && ans[ele] == 0) {
                continue;
            } else {
                System.out.print(ans[ele] + " ");
            }
        }
    }

    public static void main(String[] args) {
        int[] arr1 = input2(scn.nextInt());
        int[] arr2 = input2(scn.nextInt());
        add(arr1, arr2);
    }
}
