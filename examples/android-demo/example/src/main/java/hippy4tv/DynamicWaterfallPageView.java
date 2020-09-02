package hippy4tv;

import android.content.Context;

import com.tencent.mtt.hippy.uimanager.HippyViewBase;
import com.tencent.mtt.hippy.uimanager.NativeGestureDispatcher;

import tvkit.waterfall.WaterfallPageView;

class DynamicWaterfallPageView extends WaterfallPageView implements HippyViewBase {
  private NativeGestureDispatcher mGestureDispatcher;
  public DynamicWaterfallPageView(Context context) {
    super(context);
  }

  @Override
  public NativeGestureDispatcher getGestureDispatcher() {
    return mGestureDispatcher;
  }

  @Override
  public void setGestureDispatcher(NativeGestureDispatcher dispatcher) {
      mGestureDispatcher = dispatcher;
  }
}
