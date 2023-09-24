import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import { Community } from "../icons/community";

export const CardBalance2 = () => {
  return (
    <Card className="xl:max-w-sm bg-default-50 rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className="text-default-900">Average Tournament finish</span>
            <span className="text-default-900 text-xs">36 tournaments</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-default-900 text-xl font-semibold">
            2.45
          </span>
          <span className="text-danger text-xs">- 4.5%</span>
        </div>
        <div className="flex items-center gap-6">
        </div>
      </CardBody>
    </Card>
  );
};
