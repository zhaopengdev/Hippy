package hippy4tv;

import android.content.Context;
import android.graphics.Color;
import android.view.View;

import com.tencent.mtt.hippy.annotation.HippyController;
import com.tencent.mtt.hippy.views.view.HippyViewGroupController;

import tvkit.waterfall.WaterfallPageView;


@HippyController(name = "Waterfall")
public class WaterfallViewController extends HippyViewGroupController {
    @Override
    protected View createViewImpl(Context context) {
        final WaterfallPageView wpv = new WaterfallPageView(context);
        wpv.setBackgroundColor(Color.RED);
        return wpv;
    }





}
