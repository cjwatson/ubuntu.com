import React from "react";
import { mount, shallow } from "enzyme";

import DetailsTabs from "./DetailsTabs";
import {
  contractTokenFactory,
  userSubscriptionEntitlementFactory,
  userSubscriptionFactory,
} from "advantage/tests/factories/api";
import { UserSubscription } from "advantage/api/types";
import { EntitlementType } from "advantage/api/enum";

describe("DetailsTabs", () => {
  let subscription: UserSubscription;

  beforeEach(async () => {
    subscription = userSubscriptionFactory.build();
  });

  it("defaults to the features tab", () => {
    const wrapper = shallow(<DetailsTabs subscription={subscription} />);
    expect(wrapper.find("[data-test='features-content']").exists()).toBe(true);
  });

  it("can change tabs", () => {
    const wrapper = mount(<DetailsTabs subscription={subscription} />);
    expect(wrapper.find("[data-test='docs-content']").exists()).toBe(false);
    wrapper.find("[data-test='docs-tab']").simulate("click");
    wrapper.update();
    expect(wrapper.find("[data-test='docs-content']").exists()).toBe(true);
  });

  it("only displays one link to livepatch docs", () => {
    subscription = userSubscriptionFactory.build({
      entitlements: [
        userSubscriptionEntitlementFactory.build({
          enabled_by_default: true,
          type: EntitlementType.Livepatch,
        }),
        userSubscriptionEntitlementFactory.build({
          enabled_by_default: true,
          type: EntitlementType.LivepatchOnprem,
        }),
      ],
    });
    const wrapper = mount(<DetailsTabs subscription={subscription} />);
    // Switch to the docs tab:
    wrapper.find("[data-test='docs-tab']").simulate("click");
    const docsLinks = wrapper.find("[data-test='doc-link']");
    expect(docsLinks.length).toBe(1);
    expect(docsLinks.at(0).text()).toBe("Livepatch");
  });

  it("only displays one link to ESM docs", () => {
    subscription = userSubscriptionFactory.build({
      entitlements: [
        userSubscriptionEntitlementFactory.build({
          enabled_by_default: true,
          type: EntitlementType.EsmApps,
        }),
        userSubscriptionEntitlementFactory.build({
          enabled_by_default: true,
          type: EntitlementType.EsmInfra,
        }),
      ],
    });
    const wrapper = mount(<DetailsTabs subscription={subscription} />);
    // Switch to the docs tab:
    wrapper.find("[data-test='docs-tab']").simulate("click");
    const docsLinks = wrapper.find("[data-test='doc-link']");
    expect(docsLinks.length).toBe(1);
    expect(docsLinks.at(0).text()).toBe("ESM Infra & ESM Apps");
  });

  it("can display a contract token", () => {
    const wrapper = mount(
      <DetailsTabs
        subscription={subscription}
        token={contractTokenFactory.build()}
      />
    );
    // Switch to the docs tab:
    wrapper.find("[data-test='docs-tab']").simulate("click");
    expect(wrapper.find("[data-test='contract-token']").exists()).toBe(true);
  });
});
