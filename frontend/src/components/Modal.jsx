import { Show } from "solid-js";
import { Portal } from "solid-js/web";

export default function Modal(props) {
  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 transform transition-all">
            <div class="flex justify-between items-center p-6 border-b">
              <h3 class="text-xl font-semibold text-gray-900">{props.title}</h3>
              <button
                onClick={props.onClose}
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span class="text-2xl">&times;</span>
              </button>
            </div>
            <div class="p-6">{props.children}</div>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
